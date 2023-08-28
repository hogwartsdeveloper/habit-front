import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ThreeSupportService } from './services/three-support.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AuthGuard } from './auth/auth.guard';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToolbarComponent,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  providers: [
    ThreeSupportService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
