import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitRoutingModule } from './habit-routing.module';
import { HabitComponent } from './habit/habit.component';
import { HabitModalComponent } from './habit-modal/habit-modal.component';
import { ModalBaseComponent } from '../../utils/ui/modal-base/modal-base.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { PickItemByStatusDirective } from '../../utils/ui/directives/pick-item-by-status.directive';
import { ButtonComponent } from '../../utils/ui/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { HabitViewModule } from './habit-view/habit-view.module';
import { LoadComponent } from 'ui';

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
