import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent, LoadComponent, ModalBaseComponent } from 'ui';

import { HabitRoutingModule } from './habit-routing.module';
import { HabitComponent } from './habit/habit.component';
import { HabitModalComponent } from './habit-modal/habit-modal.component';
import { PickItemByStatusDirective } from '../../utils/ui/directives/pick-item-by-status.directive';
import { HabitViewModule } from './habit-view/habit-view.module';

@NgModule({
  declarations: [HabitComponent, HabitModalComponent],
  imports: [
    CommonModule,
    HabitRoutingModule,
    ModalBaseComponent,
    NzToolTipModule,
    PickItemByStatusDirective,
    ButtonComponent,
    TranslateModule,
    HabitViewModule,
    LoadComponent,
  ],
})
export class HabitModule {}
