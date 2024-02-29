import {Component, Inject, OnInit, signal} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take, tap } from 'rxjs';
import * as dayjs from 'dayjs';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'ui';
import {
  HabitCalendarStatus,
  IHabit,
  IHabitCalendar, IHabitRecord,
} from '../models/habit.interface';
import { HabitService } from '../services/habit.service';

@Component({
  templateUrl: './habit-modal.component.html',
  styleUrls: ['./habit-modal.component.scss'],
})
export class HabitModalComponent implements OnInit {
  weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  today = dayjs().format('YYYY-MM-DD');
  days: any[];
  selectedDay: IHabitCalendar | null;
  loading = signal(false);
  readonly HabitCalendarStatus = HabitCalendarStatus;

  constructor(
    private dialogRef: MatDialogRef<HabitModalComponent>,
    private messageService: MessageService,
    private translateService: TranslateService,
    private habitService: HabitService,
    @Inject(MAT_DIALOG_DATA)
    public habit: IHabit
  ) {}

  ngOnInit() {
    this.getDays();
  }

  getDays() {
    this.days = [];
    const startDate = dayjs(this.habit.startDate);
    const endDate = dayjs(this.habit.endDate);

    const days = dayjs(endDate).diff(startDate, "day");
    const weekDay = startDate.day();

    this.days.unshift(...Array(weekDay - 1));

    for (let i = 0; i < days; i++) {
      const day = startDate.add(i, 'day').format("YYYY-MM-DDT00:00:00");
      const fDay = this.habit.record?.find(item => item.date === day);

      if (fDay) {
        this.days.push(fDay);
        continue;
      }

      this.days.push({ date: day });
    }
  }

  onDone(day: IHabitCalendar) {
    this.selectedDay = day;
    // if (this.data.lastActiveDate === this.today) {
    //   this.messageService.warning(
    //     this.translateService.instant('habit.message.warningAddRecord')
    //   );
    //   this.selectedDay = null;
    //
    //   return;
    // }

    if (day.date === this.today) {
      switch (day.status) {
        case HabitCalendarStatus.Clean:
          day.status = HabitCalendarStatus.Success;
          break;
        case HabitCalendarStatus.Success:
          day.status = HabitCalendarStatus.Danger;
          break;
        case HabitCalendarStatus.Danger:
          day.status = HabitCalendarStatus.Clean;
          break;
      }
    }
  }

  close(payload?: IHabit) {
    this.dialogRef.close(payload);
  }

  save() {
    this.loading.set(true);
    this.habitService
      .addRecord(this.habit.id, {
        date: this.selectedDay?.date!,
        status: this.selectedDay?.status!,
      })
      .pipe(
        tap(() => this.loading.set(false)),
        take(1)
      )
      .subscribe((habit) => {
        this.messageService.success(
          this.translateService.instant('habit.message.successAddRecord')
        );
        this.close(habit);
      });
  }
}
