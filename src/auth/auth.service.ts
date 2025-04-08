import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { OtpVerification } from './otp-verification.entity';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt'; // Import JwtService

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(OtpVerification) private otpRepo: Repository<OtpVerification>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService, // Inject JwtService
  ) {}

  async register(email: string) {
    let user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      user = this.userRepo.create({ email });
      await this.userRepo.save(user);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins

    const otpRecord = this.otpRepo.create({ user, otp, expiresAt });
    await this.otpRepo.save(otpRecord);

    await this.mailService.sendOtp(email, otp);
    this.logger.log(`OTP sent to ${email}: ${otp}`);

    return { message: 'OTP sent to email' };
  }

  async verify(email: string, otp: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otpRecord = await this.otpRepo.findOne({
      where: { user: { id: user.id }, otp, isUsed: false },
      order: { createdAt: 'DESC' },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }

    if (otpRecord.expiresAt && otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    otpRecord.isUsed = true;
    user.isVerified = true;

    await this.otpRepo.save(otpRecord);
    await this.userRepo.save(user);

    // Generate and return JWT after successful verification
    const payload = { email: user.email, id: user.id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Account verified successfully',
      accessToken: token, // Return JWT to the user
    };
  }
}
