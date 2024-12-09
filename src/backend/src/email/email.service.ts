import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.password'),
      },
    });
  }

  async sendVerificationEmail(to: string, verificationCode: string) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject: '이메일 인증',
      html: `
        <h1>이메일 인증</h1>
        <p>아래의 인증 코드를 입력해주세요:</p>
        <h2>${verificationCode}</h2>
        <p>이 코드는 3분간 유효합니다.</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
