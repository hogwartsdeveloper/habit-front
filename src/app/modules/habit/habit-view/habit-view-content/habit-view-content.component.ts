import { Component, Input } from '@angular/core';
import { IHabit } from '../../models/habit.interface';
import { HabitModalComponent } from '../../habit-modal/habit-modal.component';
import { HabitCreateModalComponent } from '../../habit-create-modal/habit-create-modal.component';
import { take } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { HabitService } from '../../services/habit.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-habit-view-content',
  templateUrl: './habit-view-content.component.html',
  styleUrls: ['./habit-view-content.component.scss'],
})
export class HabitViewContentComponent {
  @Input({ required: true }) habits: IHabit[] = [];
  @Input() viewType: 'interactive' | 'show' = 'interactive';

  constructor(
    private dialog: MatDialog,
    private message: NzMessageService,
    private translateService: TranslateService,
    private habitService: HabitService
  ) {}

  openHabitModal(habit: IHabit) {
    this.dialog
      .open(HabitModalComponent, {
        width: '700px',
        height: '600px',
        panelClass: 'noBackground',
        autoFocus: false,
        data: habit,
      })
      .afterClosed()
      .subscribe((habit: IHabit) => {
        if (!habit) {
          return;
        }

        const findIndex = this.habits.findIndex(
          (item) => item._id === habit._id
        );
        this.habits[findIndex] = habit;
      });
  }

  countTotalDay(habit: IHabit) {
    return this.habitService.countTotalDay(habit);
  }

  onEdit(habit: IHabit) {
    this.dialog
      .open(HabitCreateModalComponent, {
        width: '400px',
        height: '500px',
        panelClass: 'noBackground',
        autoFocus: false,
        data: habit,
      })
      .afterClosed()
      .subscribe((habit: IHabit) => {
        if (!habit) {
          return;
        }

        const findIndex = this.habits.findIndex(
          (item) => item._id === habit._id
        );
        this.habits[findIndex] = habit;
      });
  }

  onDelete(id: string) {
    this.habitService
      .delete(id)
      .pipe(take(1))
      .subscribe((habit) => {
        this.habits = this.habits.filter((item) => item._id !== habit._id);
        this.message.success(
          this.translateService.instant('habit.message.successRemove')
        );
      });
  }
}
