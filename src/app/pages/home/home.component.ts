import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DefaultComponent } from 'src/app/modal';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { throwError } from 'rxjs';
import { ElasticsearchService } from 'src/app/services/elasticsearch.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GooglePlaceDirective } from "node_modules/ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
@ViewChild("placesRef") placesRef : GooglePlaceDirective;
  options = {
    types: ['(cities)'],
    componentRestrictions: {}
    }
  user: any;
  homeData:any;
  baseImgPath:string;
  backgroundImg:string;
  searchDropdownData:any[]=[];
  partnerData:any[]=[];
  searchForm:FormGroup;

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['<span class="material-icons text-muted"> arrow_back </span>', '<span class="material-icons text-theme-blue"> arrow_forward </span>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      1361: {
        items: 3
      }
    },
    nav: true
  }

  customOptionslnw: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      1361: {
        items: 3
      }
    },
    nav: false
  }
  propertyList: any;
  cityName: any;

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private event: EventService,
    private es: ElasticsearchService,
    private router: Router,
    private storage: StorageService,
    private fb:FormBuilder,
  ) {
    this.propertyList = [];
    this.getPropertyList();
    this.baseImgPath = environment.BASE_IMAGE_ENDPOINT;
   }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      option: ['', Validators.required],
      search: [''],
      // personalisedMsg: [''],
    });
    this.getHomeData();
    this.getSearchDropdowndata();
    this.getPartnersList();
  }

  getHomeData(){
    this.api.get(`home`).subscribe((resp:any)=>{
      this.homeData=resp.data;
      this.backgroundImg=this.baseImgPath+ 'home/'+ this.homeData.bannerData.banner_image;
      // console.log(this.homeData);
    });
  }

  getSearchDropdowndata(){
    this.api.get(`hometype/all`).subscribe((resp:any)=>{
      this.searchDropdownData=resp.data;
      console.log(this.searchDropdownData);
      
    })
  }

  getPartnersList(){
    this.api.get(`partner/list`).subscribe((resp:any)=>{
      this.partnerData=resp.data;
      console.log(this.partnerData);
      
    })
  }

   handleAddressChange(address) {
    // Do some stuff
    console.log(this.searchForm.value.option,this.searchForm.value.search);
    this.cityName=address.name;
    // console.log(address.name);
    
}

  // OPEN MODAL 1
  openModal(mtype) {
    this.dialog.open(DefaultComponent, {
      disableClose: true,
      width: '100%',
      maxWidth: '400px',
      data: { type: mtype }
    });
  }
  getEmpl() {
    this.event.setLoaderEmmit(false);
    const opts = { params: new HttpParams({ fromString: '_page=1&_limit=10' }) };
    // this.api.get('employees', true, opts.params).subscribe(() => {
    this.api.get('employees').subscribe(() => {

    }, (e) => {
      console.log(e);
    });
  }

  encriptAndRoute(id) {
    const d = this.storage.encription(id, 'PROPERTY_ID')
    console.log(this.storage.decription(d, 'PROPERTY_ID'))
    this.router.navigate(['/details', (this.storage.encription(id, 'PROPERTY_ID')).toString()]);
  }

  getPropertyList() {
    this.es.getAllDocuments('properties', 'properties')
      .then(response => {
        response.hits.hits.map((item)=>{
          if(item._source.isFeatured === 'Yes') {
            this.propertyList.push(item);
          }
        })
      }, error => {
        console.error(error);
      }).then(() => {
        console.log('Show Property Completed!');
      });
  }

 
  navigateToSearch() {
    const data =  {
      city_name : this.cityName,
      home_type: this.searchForm.value.option,
    }
    console.log(data);
    
    this.storage.setDataForSearch(data).then(()=>{
      this.router.navigate(['/search']);
    });
  }
}
