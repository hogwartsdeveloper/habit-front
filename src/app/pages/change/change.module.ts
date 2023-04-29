import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeComponent } from './change/change.component';
import { ChangeRoutingModule } from './change-routing.module';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ChangeComponent],
  imports: [
    CommonModule,
    ChangeRoutingModule,
    ToolbarComponent,
    MatButtonModule,
  ],
})
export class ChangeModule {}
