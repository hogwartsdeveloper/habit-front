import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as dayjs from 'dayjs';
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
import { take } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

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
  templateUrl: './habit-create-modal.component.html',
  styleUrls: ['./habit-create-modal.component.scss'],
})
export class HabitCreateModalComponent implements OnInit {
  type: 'create' | 'edit';
  form: FormGroup;
  inputConfigs: IInput[] = habitInputConfigs;

  constructor(
    private dialogRef: MatDialogRef<HabitCreateModalComponent>,
    private message: NzMessageService,
    private translateService: TranslateService,
    private habitServices: HabitService,
    @Inject(MAT_DIALOG_DATA) private data: IHabit,
    private readonly authService: AuthService
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
    switch (this.type) {
      case 'create':
        this.habitServices
          .add({
            ...this.form.getRawValue(),
            userId: this.authService.user$.value?.id!,
          })
          .pipe(take(1))
          .subscribe((res) => {
            this.message.success(
              this.translateService.instant('habit.message.successCreate')
            );

            this.onClose(res);
          });
        break;

      case 'edit':
        this.habitServices
          .update(this.data._id, this.form.getRawValue())
          .pipe(take(1))
          .subscribe((res) => {
            this.message.success(
              this.translateService.instant('habit.message.successEdit')
            );

            this.onClose(res);
          });
        break;
    }
  }
}
