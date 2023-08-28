import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChangeComponent } from './change/change.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ChangeComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeRoutingModule {}
