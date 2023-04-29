import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PromoComponent } from './promo/promo.component';

const routes: Routes = [
  {
    path: '',
    component: PromoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromoRoutingModule {}
