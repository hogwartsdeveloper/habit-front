import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';

import { UserService } from '../../user/user.service';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { PasswordRecovery } from './password-recovery.model';
import { TokenService } from '../../token/token.service';
import { EmailService } from '../../email/email.service';
import {
  PASSWORD_CHANGE_ERROR,
  PASSWORD_CHANGE_SUCCESS,
  PASSWORD_RECOVERY_MSG_TITLE,
  PASSWORD_RECOVERY_RESULT,
} from './password.constants';
import { PasswordChangeDto } from './dto/password-change.dto';

@Injectable()
export class PasswordService {
  constructor(
    @InjectModel(PasswordRecovery.name)
    private readonly recoveryModel: Model<PasswordRecovery>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService
  ) {}

  async recovery(dto: PasswordRecoveryDto) {
    await this.userService.findByEmail(dto.email);
    const token = await this.tokenService.create(dto, Date.now() + 60000 * 15);
    await new this.recoveryModel({
      email: dto.email,
      token,
      isRestored: false,
    }).save();

    try {
      await this.emailService.sendMessage(
        dto.email,
        PASSWORD_RECOVERY_MSG_TITLE,
        `http://${this.configService.get(
          'HOST'
        )}:4200/auth/password_change/${token}`
      );
    } catch (e: any) {
      throw new InternalServerErrorException(e.message);
    }

    return { result: PASSWORD_RECOVERY_RESULT };
  }

  async change(token: string, dto: PasswordChangeDto) {
    const data = await this.checkToken(token);

    await this.userService.changePassword(data.email, dto.password);
    data.isRestored = true;
    await data.save();

    return { result: PASSWORD_CHANGE_SUCCESS };
  }

  async checkToken(token: string) {
    try {
      await this.tokenService.verify(token);
    } catch (e) {
      throw new NotFoundException(PASSWORD_CHANGE_ERROR);
    }

    const data = await this.recoveryModel.findOne({ token });
    if (!data) {
      throw new NotFoundException(PASSWORD_CHANGE_ERROR);
    }

    return data;
  }
}
