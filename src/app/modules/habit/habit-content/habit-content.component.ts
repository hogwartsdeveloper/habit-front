import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageService } from 'ng-zorro-antd/message';

import { HabitViewEnum } from '../habit/models/habit-view.enum';
import { IHabit } from '../models/habit.interface';
import { HabitService } from '../services/habit.service';
import { ButtonComponent } from '../../../utils/ui/button/button.component';
import { ICalendar } from '../habit/models/calendar.interface';
import { HabitCreateModalComponent } from '../habit-create-modal/habit-create-modal.component';
import { HabitModalComponent } from '../habit-modal/habit-modal.component';
import { take } from 'rxjs';
import { IHabits } from '../models/habits.interface';

@Component({
  selector: 'app-habit-content',
  templateUrl: './habit-content.component.html',
  styleUrls: ['./habit-content.component.scss'],
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    NzDatePickerModule,
    ButtonComponent,
    CommonModule,
    TranslateModule,
    FormsModule,
  ],
})
export class HabitContentComponent implements OnChanges {
  @Input() viewType: 'interactive' | 'show' = 'interactive';
  @Input({ required: true }) allHabits: IHabits;
  habits: IHabit[] = [];
  HabitViewEnum = HabitViewEnum;
  type: HabitViewEnum = HabitViewEnum.Active;

  calendar: ICalendar = {
    startDate: moment().startOf('years').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  };

  constructor(
    private dialog: MatDialog,
    private message: NzMessageService,
    private translateService: TranslateService,
    private habitService: HabitService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['allHabits']) {
      this.habits = this.allHabits[this.type.toString().toLowerCase()];
    }
  }

  onChangeViewType(type: HabitViewEnum) {
    this.type = type;
    this.habits = this.allHabits[this.type.toString().toLowerCase()];
  }

  countTotalDay(habit: IHabit) {
    return this.habitService.countTotalDay(habit);
  }

  onEdit(habit: IHabit) {
    this.dialog.open(HabitCreateModalComponent, {
      width: '400px',
      height: '500px',
      panelClass: 'noBackground',
      autoFocus: false,
      data: habit,
    });
  }

  onDelete(id: string) {
    this.habitService
      .delete(id)
      .pipe(take(1))
      .subscribe(() => {
        this.message.success(
          this.translateService.instant('habit.message.successRemove')
        );
      });
  }

  addHabit() {
    this.dialog.open(HabitCreateModalComponent, {
      width: '400px',
      height: '500px',
      panelClass: 'noBackground',
      autoFocus: false,
    });
  }

  openHabitModal(habit: IHabit) {
    this.dialog.open(HabitModalComponent, {
      width: '700px',
      height: '600px',
      panelClass: 'noBackground',
      autoFocus: false,
      data: habit,
    });
  }

  changeDate(date: Date[]) {
    this.calendar.startDate = moment(date[0]).format('YYYY-MM-DD');
    this.calendar.endDate = moment(date[1]).format('YYYY-MM-DD');
  }
}
