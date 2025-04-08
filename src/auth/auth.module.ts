// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { OtpVerification } from './otp-verification.entity';
import { MailModule } from '../mail/mail.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.JWT_SECRET_KEY}`, // Replace with your actual secret key
      signOptions: { expiresIn: '1h' }, // Set expiration time for JWT
    }),TypeOrmModule.forFeature([User, OtpVerification]), MailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule]
})
export class AuthModule {}
