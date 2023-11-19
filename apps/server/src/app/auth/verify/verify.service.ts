import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';

import { Verify, VerifyDocument } from './verify.model';
import { UserService } from '../../user/user.service';
import { TokenService } from '../../token/token.service';
import { EmailService } from '../../email/email.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import {
  EXHAUSTED_VERIFY_ATTEMPT_ERROR,
  MAX_VERIFY,
  WRONG_VERIFY_CODE_ERROR,
} from './verify.constants';
import {
  EMAIL_ALREADY_CONFIRMED_ERROR,
  REGISTER_EMAIL_MSG_TITLE,
  REGISTER_RESULT,
} from '../auth.constants';
import { AuthTokenService } from '../auth-token.service';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class VerifyService {
  constructor(
    @InjectModel(Verify.name) private readonly verifyModel: Model<Verify>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly authTokenService: AuthTokenService
  ) {}

  async create(email: string) {
    return new this.verifyModel({
      email,
      code: this.generateCode(),
      isVerify: false,
      countAttempt: 0,
    }).save();
  }

  async verifyEmail(dto: VerifyEmailDto, response: Response) {
    const user = await this.userService.findByEmail(dto.email);
    await this.userService.checkPassword(dto.password, user.passwordHash);

    const verifyData = await this.verifyModel.findOne({ email: dto.email });
    await this.checkVerify(verifyData!);

    if (verifyData!.countAttempt === MAX_VERIFY) {
      throw new ForbiddenException(EXHAUSTED_VERIFY_ATTEMPT_ERROR);
    }

    if (verifyData!.code !== dto.code) {
      verifyData!.countAttempt++;
      await verifyData!.save();
      throw new BadRequestException(WRONG_VERIFY_CODE_ERROR);
    }

    verifyData!.isVerify = true;
    await verifyData!.save();

    const tokens = await this.authTokenService.createTokensForAuth(user);
    return this.authTokenService.saveCookie(tokens, response);
  }

  async tryAgainVerify(dto: AuthDto) {
    const user = await this.userService.findByEmail(dto.email);
    await this.userService.checkPassword(dto.password, user.passwordHash);

    const verify = await this.tryAgain(dto.email);
    try {
      await this.emailService.sendMessage(
        dto.email,
        REGISTER_EMAIL_MSG_TITLE,
        verify!.code.toString()
      );
    } catch (e: any) {
      throw new InternalServerErrorException(e.message);
    }

    return { result: REGISTER_RESULT };
  }

  private async tryAgain(email: string) {
    const data = await this.verifyModel.findOne({ email });
    await this.checkVerify(data!);

    return this.verifyModel.findOneAndUpdate(
      { email },
      { code: this.generateCode(), countAttempt: 0 },
      { new: true }
    );
  }

  private generateCode() {
    return Math.floor(Math.random() * 8999 + 1000);
  }

  private checkVerify(data: VerifyDocument) {
    if (data.isVerify) {
      throw new ConflictException(EMAIL_ALREADY_CONFIRMED_ERROR);
    }
  }
}
