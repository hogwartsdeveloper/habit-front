import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({ selector: '[pickItemByStatus]', standalone: true })
export class PickItemByStatusDirective implements OnInit {
  @Input() pickItemByStatus: 'basic' | 'success' | 'danger';
  @HostListener('click')
  onClick() {
    this.changeColor();
  }
  constructor(private el: ElementRef<HTMLElement>) {}

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
