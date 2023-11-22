import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [MatButtonModule, CommonModule],
})
export class ButtonComponent implements OnChanges {
  @Input() type: 'success' | 'danger' | 'insta' = 'success';
  @Input() view: 'border' | 'basic' = 'basic';
  @Input() animation: 'pulse' | '' = '';
  @Input() disabled = false;
  @Input() customStyle: 'white' | '' = '';

  constructor(private element: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled']) {
      this.onDisable();
    }
  }

  onDisable() {
    this.element.nativeElement.style.pointerEvents = this.disabled
      ? 'none'
      : 'auto';
  }
}
