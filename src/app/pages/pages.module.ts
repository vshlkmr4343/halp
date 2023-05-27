import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { ModalModule } from '../modal/modal.module';
import { MaterialModule } from '../material.module';
import { LoaderModule } from '../loader/loader.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DetailsComponent } from './details/details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetInTouchComponent } from './get-in-touch/get-in-touch.component';
import { ContactComponent } from './contact/contact.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { GalleryComponent } from './gallery/gallery.component';
import { SearchComponent } from './search/search.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SharedModule } from '../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

@NgModule({
  declarations: [HomeComponent, DetailsComponent, GetInTouchComponent, ContactComponent, TermsAndConditionsComponent, GalleryComponent, SearchComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    ModalModule,
    MaterialModule,
    LoaderModule,
    CarouselModule,
    NgxSliderModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule,
    GooglePlaceModule
  ],
  providers: [
  ]
})
export class PagesModule { }
