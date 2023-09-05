import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitRoutingModule } from './habit-routing.module';
import { HabitComponent } from './habit/habit.component';
import { HabitContentComponent } from './habit-content/habit-content.component';

@NgModule({
  declarations: [HabitComponent],
  imports: [CommonModule, HabitRoutingModule, HabitContentComponent],
})
export class HabitModule {}
