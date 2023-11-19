import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HabitComponent } from './habit/habit.component';

const routes: Routes = [
  {
    path: '',
    component: HabitComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HabitRoutingModule {}
