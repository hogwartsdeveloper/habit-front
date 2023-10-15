import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './modules/auth/services/auth.guard';

const routes: Routes = [
  {
    path: 'change',
    loadChildren: () =>
      import('./modules/habit/habit.module').then((m) => m.HabitModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
