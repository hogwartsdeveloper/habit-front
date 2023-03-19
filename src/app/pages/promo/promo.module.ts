import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromoComponent } from './promo/promo.component';
import {PromoRoutingModule} from "./promo-routing.module";
import {ThreeSupportService} from "./services/three-support.service";
import { LearnComponent } from './learn/learn.component';



@NgModule({
  declarations: [
    PromoComponent,
    LearnComponent
  ],
  imports: [
    CommonModule,
    PromoRoutingModule
  ],
  providers: [
      ThreeSupportService
  ]
})
export class PromoModule { }
