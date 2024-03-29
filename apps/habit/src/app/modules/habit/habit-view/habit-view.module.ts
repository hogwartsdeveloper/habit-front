import { NgModule } from '@angular/core';
import { HabitViewComponent } from './habit-view.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitViewContentComponent } from './habit-view-content/habit-view-content.component';
import { ButtonComponent } from 'ui';
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [HabitViewComponent, HabitViewContentComponent],
    imports: [
        CommonModule,
        ButtonComponent,
        NzTabsModule,
        NzDatePickerModule,
        MatIconModule,
        MatMenuModule,
        FormsModule,
        MatButtonModule,
    ],
  exports: [HabitViewComponent],
})
export class HabitViewModule {}
