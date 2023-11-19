import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import dayjs from 'dayjs';

import { UserDocument, User } from './user.model';
import { FileService } from '../file/file.service';
import { RegistrationDto } from '../auth/dto/registration.dto';
import { ALREADY_REGISTERED_ERROR } from '../auth/auth.constants';
import { EMAIL_ALREADY_EXISTS_ERROR, USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './user.constants';
import { MFile } from '../file/mfile.class';
import { IdValidationPipe } from '../pipe/id-validation.pipe';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly fileService: FileService,
    private readonly idValidationPipe: IdValidationPipe
  ) {}

  async create(dto: RegistrationDto): Promise<UserDocument> {
    const oldUser = await this.userModel.findOne({ email: dto.email });
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    const salt = await genSalt(10);
    const user = new this.userModel({
      email: dto.email,
      passwordHash: await hash(dto.password, salt),
      firstName: dto.firstName,
      lastName: dto.lastName,
      img: '',
    });

    return user.save();
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND_ERROR);
    }

    return user;
  }

  async findById(id: string) {
    this.idValidationPipe.transform(id, {type: 'param'})
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND_ERROR);
    }

    return user;
  }

  async update(userId: string, updateData: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }

    return user;
  }

  async updateImage(userId: string, file: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND_ERROR);
    }

    const buffer = await this.fileService.convertToWebP(
      Buffer.from(file.split(',')[1], 'base64'),
    );

    await this.checkAndRemoveImage(user.img);

    const img = await this.fileService.saveFiles([
      new MFile({
        originalname: `${userId}_${dayjs().format('mm:ss')}.webp`,
        buffer,
      }),
    ]);

    return this.update(user._id.toString(), { img: img[0].url });
  }

  async removeImage(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND_ERROR);
    }

    await this.checkAndRemoveImage(user.img);

    return this.update(userId, { img: '' });
  }

  async checkAndRemoveImage(imgPath: string) {
    if (!imgPath) {
      return;
    }

    let path = imgPath?.replace('static', 'uploads');
    path = `${process.cwd()}/${path}`;
    if (await this.fileService.checkFile(path)) {
      await this.fileService.removeFile(path);
    }
  }

  async checkPassword(password: string, passwordHash: string) {
    const isCorrectPassword = await compare(password, passwordHash);

    if (!isCorrectPassword) {
      throw new BadRequestException(WRONG_PASSWORD_ERROR);
    }
  }

  async verifyEmailNotExist(email: string) {
    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new ConflictException(EMAIL_ALREADY_EXISTS_ERROR);
    }
  }

  async verifyEmailExist(email: string) {
    await this.findByEmail(email);
  }

  async changePassword(email: string, password: string) {
    const user = await this.findByEmail(email);
    const salt = await genSalt(10);
    user.passwordHash = await hash(password, salt);
    await user.save();
  }
}
