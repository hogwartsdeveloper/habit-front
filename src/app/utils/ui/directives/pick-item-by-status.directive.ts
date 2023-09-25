import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Directive({ selector: '[pickItemByStatus]', standalone: true })
export class PickItemByStatusDirective implements OnInit, OnChanges {
  @Input() pickItemByStatus: 'basic' | 'success' | 'danger';
  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pickItemByStatus']) {
      this.changeColor();
    }
  }

  ngOnInit() {
    this.changeColor();
  }

  changeColor() {
    switch (this.pickItemByStatus) {
      case 'basic':
        this.el.nativeElement.style.background = 'transparent';
        break;
      case 'success':
        this.el.nativeElement.style.background = 'var(--cl-success)';
        break;
      case 'danger':
        this.el.nativeElement.style.background = 'var(--cl-danger)';
        break;
    }
  }
}
