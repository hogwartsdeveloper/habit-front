import {Component, Inject, OnInit, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as dayjs from 'dayjs';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'ui';
import {IHabit, IHabitRecord,} from '../models/habit.interface';
import {HabitService} from '../services/habit.service';

@Component({
  templateUrl: './habit-modal.component.html',
  styleUrls: ['./habit-modal.component.scss'],
})
export class HabitModalComponent implements OnInit {
  weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  today = dayjs().format("YYYY-MM-DDT00:00:00");
  days: IHabitRecord[];
  selectedDay: IHabitRecord | null;
  loading = signal(false);

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
    const startWeekDay = startDate.day();
    const endWeekDay = endDate.day();

    this.days.unshift(...Array(startWeekDay - 1));

    for (let i = 0; i < days; i++) {
      const day = startDate.add(i, 'day').format("YYYY-MM-DDT00:00:00");
      const fDay = this.habit.record?.find(item => item.date === day);

      if (fDay) {
        this.days.push(fDay);
        continue;
      }

      this.days.push({ date: day, isComplete: null });
    }

    this.days.push(...Array(7 - (endWeekDay - 1)));
  }

  onDone(day: IHabitRecord) {
    this.selectedDay = day;

    if (day.date === this.today) {
      switch (day.isComplete) {
        case null:
          day.isComplete = true;
          break;
        case true:
          day.isComplete = false;
          break;
        case false:
          day.isComplete = null;
          break;
      }
    }
  }

  close(payload?: IHabit) {
    this.dialogRef.close(payload);
  }

  save() {
    // this.loading.set(true);
    // this.habitService
    //   .addRecord(this.habit.id, {
    //     date: this.selectedDay?.date!,
    //     status: this.selectedDay?.status!,
    //   })
    //   .pipe(
    //     tap(() => this.loading.set(false)),
    //     take(1)
    //   )
    //   .subscribe((habit) => {
    //     this.messageService.success(
    //       this.translateService.instant('habit.message.successAddRecord')
    //     );
    //     this.close(habit);
    //   });
  }
}
