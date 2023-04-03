import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'promo',
    loadChildren: () =>
      import('./pages/promo/promo.module').then((m) => m.PromoModule),
  },
  {
    path: 'change',
    loadChildren: () =>
      import('./pages/change/change.module').then((m) => m.ChangeModule),
  },
  {
    path: '',
    redirectTo: 'promo',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
