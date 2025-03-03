import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name, { timestamp: true });

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.password'),
      },
    });
  }

  async sendVerificationEmail(
    to: string,
    code: string,
    mode: 'email-verify' | 'find-password',
    miniute: number,
  ) {
    let mailOptions;

    if (mode === 'email-verify') {
      mailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to,
        subject: '이메일 인증',
        html: `
            <h1>이메일 인증</h1>
            <p>아래의 인증 코드를 입력해주세요:</p>
            <h2>${code}</h2>
            <p>이 코드는 ${miniute}분간 유효합니다.</p>
          `,
      };
    } else if (mode === 'find-password') {
      mailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to,
        subject: '임시 비밀번호 발급',
        html: `
            <h1>임시 비밀번호 발급</h1>
            <p>아래의 임시 비밀번호로 로그인하세요:</p>
            <h2>${code}</h2>
            <p>이 코드는 ${miniute}분간 유효합니다.</p>
          `,
      };
    }
    return this.transporter.sendMail(mailOptions).catch((error) => {
      this.logger.error('이메일 전송 실패:', error.message);
    });
  }
}
