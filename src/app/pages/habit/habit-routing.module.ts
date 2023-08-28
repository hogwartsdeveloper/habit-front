import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../../auth/auth.guard';
import { HabitComponent } from './habit/habit.component';

const routes: Routes = [
  {
    path: '',
    component: HabitComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HabitRoutingModule {}
