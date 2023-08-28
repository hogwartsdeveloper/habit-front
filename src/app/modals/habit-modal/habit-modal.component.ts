import { Component, OnInit } from '@angular/core';
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
import { MatDialogRef } from '@angular/material/dialog';
import { HabitService } from '../../pages/habit/services/habit.service';

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
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<HabitModalComponent>,
    private habitServices: HabitService
  ) {}
  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      isHide: new FormControl(false),
      startDate: new FormControl(moment().format('YYYY-MM-DD')),
      endDate: new FormControl(moment().add(21, 'days').format('YYYY-MM-DD')),
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.habitServices.habits$.next([
      ...this.habitServices.habits$.value,
      this.form.getRawValue(),
    ]);
    localStorage.setItem(
      'habits',
      JSON.stringify([
        ...this.habitServices.habits$.value,
        this.form.getRawValue(),
      ])
    );
    this.onClose();
  }
}
