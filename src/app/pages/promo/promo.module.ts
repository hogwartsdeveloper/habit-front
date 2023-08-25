import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromoComponent } from './promo/promo.component';
import { PromoRoutingModule } from './promo-routing.module';
import { ToolbarComponent } from '../../toolbar/toolbar.component';

@NgModule({
  declarations: [PromoComponent],
  imports: [CommonModule, PromoRoutingModule, ToolbarComponent],
})
export class PromoModule {}
