import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitRoutingModule } from './habit-routing.module';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { HabitComponent } from './habit/habit.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [HabitComponent],
  imports: [
    CommonModule,
    HabitRoutingModule,
    ToolbarComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
})
export class HabitModule {}
