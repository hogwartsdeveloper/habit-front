import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromoComponent } from './promo/promo.component';
import { PromoRoutingModule } from './promo-routing.module';
import { ThreeSupportService } from './services/three-support.service';
import { ToolbarComponent } from '../../toolbar/toolbar.component';

@NgModule({
  declarations: [PromoComponent],
  imports: [CommonModule, PromoRoutingModule, ToolbarComponent],
  providers: [ThreeSupportService],
})
export class PromoModule {}
