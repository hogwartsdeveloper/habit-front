import { Component, Inject, OnInit, signal } from '@angular/core';
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
import { habitInputConfigs } from './form.config';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { take, tap } from 'rxjs';
import {
  ButtonComponent,
  IInput,
  InputModule,
  LoadComponent,
  MessageService,
  ModalBaseComponent,
} from 'ui';

import { UserService } from '../../user/services/user.service';

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
    TranslateModule,
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
    private readonly translateService: TranslateService,
    private readonly habitServices: HabitService,
    private readonly userService: UserService,
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
    this.loading.set(true);

    switch (this.type) {
      case 'create':
        // this.habitServices
          // .add({
          //   ...this.form.getRawValue(),
          //   userId: this.userService.user$.value?.id!,
          // })
          // .pipe(
          //   tap(() => this.loading.set(false)),
          //   take(1)
          // )
          // .subscribe((res) => {
          //   this.messageService.success(
          //     this.translateService.instant('habit.message.successCreate')
          //   );
          //
          //   this.onClose(res);
          // });
        break;

      case 'edit':
        this.habitServices
          .update(this.data._id, this.form.getRawValue())
          .pipe(
            tap(() => this.loading.set(false)),
            take(1)
          )
          .subscribe((res) => {
            this.messageService.success(
              this.translateService.instant('habit.message.successEdit')
            );

            this.onClose(res);
          });
        break;
    }
  }
}
