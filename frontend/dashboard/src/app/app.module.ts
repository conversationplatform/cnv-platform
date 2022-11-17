import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './auth/auth.module';
import { MaterialModule } from './material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/Jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { DashboardModule } from './dashboard/dashboard.module';
import { TitleStrategy } from '@angular/router';
import { PageTitleStrategy } from './strategy/pageTitle.strategy';
import { APP_BASE_HREF } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    AuthModule,
    HttpClientModule,
    DashboardModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    {provide: APP_BASE_HREF, useValue: '/_/'}

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
