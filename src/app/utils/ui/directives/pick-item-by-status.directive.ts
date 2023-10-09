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
  @Input() pickItemByStatus: 'basic' | 'add' | 'overdue';
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
      case 'add':
        this.el.nativeElement.style.background = 'var(--cl-success)';
        break;
      case 'overdue':
        this.el.nativeElement.style.background = 'var(--cl-danger)';
        break;
    }
  }
}
