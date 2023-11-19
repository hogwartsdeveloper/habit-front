import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter = nodemailer.createTransport({
    host: this.configService.get('SMTP_HOST'),
    port: this.configService.get('SMTP_PORT'),
    auth: {
      user: this.configService.get('EMAIL'),
      pass: this.configService.get('EMAIL_PASSWORD'),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  async sendMessage(email: string, title: string, message: string) {
    return this.transporter.sendMail({
      from: this.configService.get('EMAIL'),
      to: email,
      subject: title,
      text: message,
    });
  }
}
