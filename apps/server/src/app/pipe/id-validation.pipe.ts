import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ERROR_ID_VALIDATION } from './pipe.constants';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): any {
    if (metadata.type !== 'param') {
      return;
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(ERROR_ID_VALIDATION);
    }

    return value;
  }
}
