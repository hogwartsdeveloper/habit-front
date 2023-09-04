import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitRoutingModule } from './habit-routing.module';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { HabitComponent } from './habit/habit.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ButtonComponent } from '../../utils/ui/button/button.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [HabitComponent],
  imports: [
    CommonModule,
    HabitRoutingModule,
    ToolbarComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ButtonComponent,
    MatInputModule,
    MatDatepickerModule,
  ],
})
export class HabitModule {}
