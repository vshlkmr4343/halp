import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';
//import {DomSanitizationService} from '@angular/platform-browser';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  //modalData: any;
  selected = 'Video';
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['<span class="material-icons">navigate_before</span>', '<span class="material-icons">navigate_next</span>'],
    items: 1,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }
  videoUrl: SafeUrl;
  url:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,public santitizer: DomSanitizer
  ) {
    // this.modalData = data;
    // console.log('Dialog Data:',data);
     if(data?.selected){
       this.selected = data.selected;
       this.videoUrl = this.santitizer.bypassSecurityTrustResourceUrl(data?.video);
      //  this.url = this.videoUrl['changingThisBreaksApplicationSecurity'];
      //  console.log('Video Url:',this.videoUrl['changingThisBreaksApplicationSecurity']);
     }
  }

  ngOnInit(): void {
  }

  getSafeUrl(){
    return this.santitizer.bypassSecurityTrustUrl(this.data?.video)
  }

}
