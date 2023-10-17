import {
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { KeyEnum } from './types/key.enum';
import { KeyboardService } from './keyboard.service';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
  standalone: true,
  providers: [KeyboardService],
})
export class KeyboardComponent {
  @ViewChildren('key') keys: QueryList<ElementRef<HTMLElement>>;
  readonly keyEnum = KeyEnum;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.keyboardService.keyAction(this.keys, event.code);
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    this.keyboardService.keyAction(this.keys, event.code, 'up');
  }

  constructor(private readonly keyboardService: KeyboardService) {}
}
