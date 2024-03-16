import {Component, Inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import * as dayjs from 'dayjs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HabitService} from '../services/habit.service';
import {IHabit} from '../models/habit.interface';
import {habitInputConfigs} from './form.config';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {take, tap} from 'rxjs';
import {ButtonComponent, IInput, InputModule, LoadComponent, MessageService, ModalBaseComponent,} from 'ui';

@Component({
  selector: 'app-habit-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    ButtonComponent,
    InputModule,
    ModalBaseComponent,
    NzDatePickerModule,
    LoadComponent,
  ],
  templateUrl: './habit-create-modal.component.html',
  styleUrls: ['./habit-create-modal.component.scss'],
})
export class HabitCreateModalComponent implements OnInit {
  type: 'create' | 'edit';
  form: FormGroup;
  inputConfigs: IInput[] = habitInputConfigs;
  loading = signal(true);

  constructor(
    private readonly dialogRef: MatDialogRef<HabitCreateModalComponent>,
    private readonly messageService: MessageService,
    private readonly habitServices: HabitService,
    @Inject(MAT_DIALOG_DATA) private data: IHabit
  ) {
    this.type = this.data ? 'edit' : 'create';
  }
  ngOnInit() {
    this.createForm();
    this.loading.set(false);
  }

  createForm() {
    this.form = new FormGroup({
      title: new FormControl(this.data?.title || '', Validators.required),
      description: new FormControl(this.data?.description || ''),
      startDate: new FormControl(
        this.data?.startDate || dayjs().format('YYYY-MM-DD')
      ),
      endDate: new FormControl(
        this.data?.endDate || dayjs().add(21, 'days').format('YYYY-MM-DD')
      ),
    });
  }

  onClose(habit?: IHabit) {
    this.dialogRef.close(habit);
  }

  onSubmit() {
    this.loading.set(true);

    switch (this.type) {
      case 'create':
        this.habitServices
          .add(this.form.getRawValue())
          .pipe(
            tap(() => this.loading.set(false)),
            take(1)
          )
          .subscribe((res) => {
            this.messageService.success("Привычка успешно создано");
            this.onClose(res);
          });
        break;

      case 'edit':
        this.habitServices
          .update(this.data.id, this.form.getRawValue())
          .pipe(
            tap(() => this.loading.set(false)),
            take(1)
          )
          .subscribe((res) => {
            this.messageService.success("Привычка успешно изменено");

            this.onClose(res);
          });
        break;
    }
  }
}
