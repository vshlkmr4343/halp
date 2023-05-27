import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default/default.component';
import { MaterialModule } from '../material.module';
import { CarouselModule } from 'ngx-owl-carousel-o';



@NgModule({
  declarations: [
    DefaultComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CarouselModule
  ],
  entryComponents: [
    DefaultComponent
  ]
})
export class ModalModule { }
