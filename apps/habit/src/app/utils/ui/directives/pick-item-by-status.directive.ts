import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { HabitCalendarStatus } from '../../../modules/habit/models/habit.interface';

@Directive({ selector: '[pickItemByStatus]', standalone: true })
export class PickItemByStatusDirective implements OnInit, OnChanges {
  @Input() pickItemByStatus: HabitCalendarStatus;
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
      case HabitCalendarStatus.Clean:
        this.el.nativeElement.style.background = 'transparent';
        break;
      case HabitCalendarStatus.Success:
        this.el.nativeElement.style.background = 'var(--cl-success)';
        break;
      case HabitCalendarStatus.Danger:
        this.el.nativeElement.style.background = 'var(--cl-danger)';
        break;
    }
  }
}
