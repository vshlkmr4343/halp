import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { LoaderModule } from './loader/loader.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderInterceptor } from './interceptor/interceptor';
import { ServicesModule } from './services/services.module';
import { CookieService } from 'ngx-cookie-service';
import { MaterialModule } from './material.module';
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    LoaderModule,
    HttpClientModule,
    GooglePlaceModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDM7MHRutsnyaiaPVqIGIpQIpFEUCC5Nqg',
      // apiKey: 'AIzaSyCMHAnTD9lsgefwodGFN3Be4JEvSaHXt7k',
      // apiKey: 'AIzaSyDDyNPwlw8xWftanmnKCenndPU0Pfu25yc',
      libraries: ['places']
    }),
  ],

  providers: [
    ServicesModule,
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
