import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChangeComponent } from './change/change.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeRoutingModule {}
