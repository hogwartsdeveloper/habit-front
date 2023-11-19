import {
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NgForOf } from '@angular/common';

import { KeyEnum } from './types/key.enum';
import { KeyboardService } from './keyboard.service';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
  standalone: true,
  providers: [KeyboardService],
  imports: [NgForOf],
})
export class KeyboardComponent {
  @ViewChildren('key') keys: QueryList<ElementRef<HTMLElement>>;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.keyboardService.keyAction(this.keys, event.code);
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    this.keyboardService.keyAction(this.keys, event.code, 'up');
  }

  keyElements: {
    type: KeyEnum;
    content: string;
  }[] = [
    {
      type: KeyEnum.A,
      content: 'A',
    },
    {
      type: KeyEnum.S,
      content: 'S',
    },
    {
      type: KeyEnum.D,
      content: 'D',
    },
    {
      type: KeyEnum.W,
      content: 'W',
    },
  ];

  constructor(private readonly keyboardService: KeyboardService) {}

  onAction(eventType: 'keydown' | 'keyup', code: KeyEnum) {
    const event = new KeyboardEvent(eventType, {
      code,
    });
    document.dispatchEvent(event);
  }
}
