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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HabitService } from '../services/habit.service';
import { IHabit } from '../models/habit.interface';
import { ButtonComponent } from '../../../utils/ui/button/button.component';
import { IInput } from '../../../utils/ui/input/models/input.interface';
import { InputComponent } from '../../../utils/ui/input/input.component';
import { habitInputConfigs } from './form.config';
import { ModalBaseComponent } from '../../../utils/ui/modal-base/modal-base.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-habit-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    ButtonComponent,
    InputComponent,
    ModalBaseComponent,
    TranslateModule,
    NzDatePickerModule,
  ],
  templateUrl: './habit-modal.component.html',
  styleUrls: ['./habit-modal.component.scss'],
})
export class HabitModalComponent implements OnInit {
  type: 'create' | 'edit';
  form: FormGroup;
  inputConfigs: IInput[] = habitInputConfigs;

  constructor(
    private dialogRef: MatDialogRef<HabitModalComponent>,
    private message: NzMessageService,
    private translateService: TranslateService,
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
        this.message.success(
          this.translateService.instant('habit.message.successCreate')
        );
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
        this.message.success(
          this.translateService.instant('habit.message.successEdit')
        );
        break;
    }

    this.habitServices.habits$.next(habits);
    localStorage.setItem('habits', JSON.stringify(habits));

    this.onClose();
  }
}
