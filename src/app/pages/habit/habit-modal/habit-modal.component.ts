import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HabitService } from '../services/habit.service';
import { IHabit } from '../models/habit.interface';

@Component({
  selector: 'app-habit-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  providers: [],
  templateUrl: './habit-modal.component.html',
  styleUrls: ['./habit-modal.component.scss'],
})
export class HabitModalComponent implements OnInit {
  type: 'create' | 'edit';
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<HabitModalComponent>,
    private habitServices: HabitService,
    @Inject(MAT_DIALOG_DATA) private data: IHabit
  ) {
    this.type = this.data ? 'edit' : 'create';
  }
  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      name: new FormControl(this.data?.name || '', Validators.required),
      description: new FormControl(this.data?.description || ''),
      isHide: new FormControl(this.data?.isHide || false),
      startDate: new FormControl(
        this.data?.startDate || moment().format('YYYY-MM-DD')
      ),
      endDate: new FormControl(
        this.data?.endDate || moment().add(21, 'days').format('YYYY-MM-DD')
      ),
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    let habits: IHabit[];

    switch (this.type) {
      case 'create':
        const id =
          this.habitServices.habits$.value[
            this.habitServices.habits$.value.length - 1
          ]?.id || 0;

        habits = [
          ...this.habitServices.habits$.value,
          {
            ...this.form.getRawValue(),
            id: id + 1,
            count: 0,
            lastActiveDate: null,
          },
        ];
        break;

      case 'edit':
        habits = [
          ...this.habitServices.habits$.value.map((habit) => {
            if (habit.id === this.data.id) {
              return { ...this.form.getRawValue(), id: this.data.id };
            }
            return habit;
          }),
        ];
        break;
    }

    this.habitServices.habits$.next(habits);
    localStorage.setItem('habits', JSON.stringify(habits));

    this.onClose();
  }
}
