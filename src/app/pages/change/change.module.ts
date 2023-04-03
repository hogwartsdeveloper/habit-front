import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeComponent } from './change/change.component';
import { ChangeRoutingModule } from './change-routing.module';

@NgModule({
  declarations: [ChangeComponent],
  imports: [CommonModule, ChangeRoutingModule],
})
export class ChangeModule {}
