import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [MatButtonModule, NgClass],
})
export class ButtonComponent implements OnChanges {
  @Input() type: 'success' | 'danger' | 'insta' = 'success';
  @Input() view: 'border' | 'basic' = 'basic';
  @Input() animation: 'pulse' | '' = '';
  @Input() disabled = false;

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
