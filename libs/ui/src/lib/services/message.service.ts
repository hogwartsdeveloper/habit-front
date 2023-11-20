import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class MessageService {
  constructor(private readonly nzMessageService: NzMessageService) {}

  success(content: string) {
    this.message(content, 'success');
  }

  error(content: string) {
    this.message(content, 'error');
  }

  info(content: string) {
    this.message(content, 'info');
  }

  warning(content: string) {
    this.message(content, 'warning');
  }

  loading(content: string) {
    this.message(content, 'loading');
  }

  private message(
    content: string,
    type: 'success' | 'error' | 'info' | 'warning' | 'loading'
  ) {
    this.nzMessageService[type](content);
  }
}
