import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule,} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {KeyboardComponent, MessageService} from 'ui';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ToolbarComponent} from './modules/toolbar/toolbar.component';
import {ThreeSupportService} from './services/three-support.service';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {HabitService} from './modules/habit/services/habit.service';
import {AuthModule} from './modules/auth/auth.module';
import {AuthInterceptor} from './modules/auth/interceptor/auth.interceptor';
import {AuthService} from './modules/auth/services/auth.service';
import {AuthGuard} from './guard/auth.guard';
import {CatchErrorHandler} from './handler/catch-error.handler';
import {UserService} from './modules/user/services/user.service';
import {FileService} from "./services/file.service";
import {en_GB, provideNzI18n, ru_RU} from "ng-zorro-antd/i18n";
import {FooterComponent} from "./modules/footer/footer.component";

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ToolbarComponent,
        BrowserAnimationsModule,
        MatNativeDateModule,
        MatDatepickerModule,
        HttpClientModule,
        AuthModule,
        KeyboardComponent,
        FooterComponent,
    ],
  providers: [
    ThreeSupportService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: LOCALE_ID, useValue: 'en-GB'},
    AuthService,
    UserService,
    AuthGuard,
    HabitService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: ErrorHandler, useClass: CatchErrorHandler },
    MessageService,
    FileService,
    provideNzI18n(en_GB)
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
