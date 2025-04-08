import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: "The user's email address",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'The OTP sent to the user\'s email' })
  @IsString()
  @Length(6, 6)
  otp: string;
}
