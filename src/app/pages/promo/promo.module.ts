import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromoComponent } from './promo/promo.component';
import { PromoRoutingModule } from './promo-routing.module';
import { ThreeSupportService } from './services/three-support.service';
import { LearnComponent } from './learn/learn.component';
import { ToolbarComponent } from '../../toolbar/toolbar.component';

@NgModule({
  declarations: [PromoComponent, LearnComponent],
  imports: [CommonModule, PromoRoutingModule, ToolbarComponent],
  providers: [ThreeSupportService],
})
export class PromoModule {}
