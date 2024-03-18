import {ErrorHandler, Injectable} from '@angular/core';
import {MessageService} from 'ui';
import {HttpErrorResponse} from "@angular/common/http";
import {IError} from "../shared/models/api-result";

@Injectable()
export class CatchErrorHandler implements ErrorHandler {
  constructor(private readonly messageService: MessageService) {}

  handleError(errorResponse: HttpErrorResponse) {
    const errors: IError[] = errorResponse.error?.errors;
    if (errors?.length) {
      for (let item of errors) {
        this.messageService.error(item.message)
      }
      return;
    }

    this.messageService.error(errorResponse.message);
  }
}
