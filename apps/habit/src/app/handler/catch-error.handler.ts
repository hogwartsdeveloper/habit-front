import { ErrorHandler, Injectable } from '@angular/core';
import { MessageService } from 'ui';

@Injectable()
export class CatchErrorHandler implements ErrorHandler {
  constructor(private readonly messageService: MessageService) {}

  handleError(error: any) {
    this.messageService.error(error?.error?.message);
    throw new Error(error);
  }
}
