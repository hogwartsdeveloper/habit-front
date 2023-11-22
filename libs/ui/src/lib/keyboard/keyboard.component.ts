import {
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardService } from './keyboard.service';
import { KeyEnum } from './types/key.enum';

@Component({
  selector: 'lib-keyboard',
  standalone: true,
  imports: [CommonModule],
  providers: [KeyboardService],
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
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
