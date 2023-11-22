import { NgModule } from '@angular/core';
import { HabitViewComponent } from './habit-view.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitViewContentComponent } from './habit-view-content/habit-view-content.component';
import { ButtonComponent } from 'ui';

@NgModule({
  declarations: [HabitViewComponent, HabitViewContentComponent],
  imports: [
    CommonModule,
    ButtonComponent,
    NzTabsModule,
    NzDatePickerModule,
    TranslateModule,
    MatIconModule,
    MatMenuModule,
    FormsModule,
  ],
  exports: [HabitViewComponent],
})
export class HabitViewModule {}
