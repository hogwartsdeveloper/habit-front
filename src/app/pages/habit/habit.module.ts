import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitRoutingModule } from './habit-routing.module';
import { HabitComponent } from './habit/habit.component';
import { HabitContentComponent } from './habit-content/habit-content.component';
import { HabitModalComponent } from './habit-modal/habit-modal.component';
import { ModalBaseComponent } from '../../utils/ui/modal-base/modal-base.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [HabitComponent, HabitModalComponent],
  imports: [
    CommonModule,
    HabitRoutingModule,
    HabitContentComponent,
    ModalBaseComponent,
    NzToolTipModule,
  ],
})
export class HabitModule {}
