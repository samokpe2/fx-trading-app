import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL, // your email
      pass: process.env.SMTP_PASSWORD, // app password
    },
  });

  async sendOtp(email: string, otp: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    });
  }
}
