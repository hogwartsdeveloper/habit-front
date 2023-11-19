import { ErrorHandler, Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class CatchErrorHandler implements ErrorHandler {
  constructor(private readonly messageService: NzMessageService) {}

  handleError(error: any) {
    this.messageService.error(error?.error?.message);
    throw new Error(error);
  }
}
