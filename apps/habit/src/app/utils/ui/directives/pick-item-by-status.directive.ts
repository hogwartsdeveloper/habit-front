import {Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges,} from '@angular/core';

@Directive({ selector: '[pickItemByStatus]', standalone: true })
export class PickItemByStatusDirective implements OnInit, OnChanges {
  @Input() pickItemByStatus: boolean | null;
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
    const element = this.el.nativeElement;
    switch (this.pickItemByStatus) {
      case null:
        element.style.background =
          element.classList.contains('active')
            ? 'rgba(255, 255, 255, 0.1)'
            : 'none';
        break;
      case true:
        element.style.background = 'var(--cl-success)';
        break;
      case false:
        element.style.background = 'var(--cl-danger)';
        break;
    }
  }
}
