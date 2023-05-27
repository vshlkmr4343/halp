import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ElasticsearchService } from 'src/app/services/elasticsearch.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, AfterViewInit {
  propertyDetails: any;
  propertyList: any;
  propertyId: any;
  clientDetails: any;
  imageURL: string;
  contactDetails: any;
  enquiryForm: FormGroup;
  // enquiryAbourArray = [
  //   'Scheduling an inspection',
  //   'Price information',
  //   'Rates & Fees',
  //   'Similar properties'
  // ];

  enquiryAbourArray = [
    {title: 'Scheduling an inspection',checked: false},
    {title: 'Price information', checked: false},
    {title: 'Rates & Fees', checked: false},
    {title: 'Similar properties', checked: false},
  ];
  selectedEnquiryArray: any;

  constructor(
    private es: ElasticsearchService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private storage: StorageService,
  ) {
    this.selectedEnquiryArray = [];
    this.formInit();
    this.getIdFromParams();
    this.imageURL = environment.BASE_IMAGE_ENDPOINT;
   }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // this.runLoanCalculator();
  }

  scrollToSummerySection() {
  document.getElementById("summerySection").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  scrollToSimilarListingSection() {
    document.getElementById("similarListing").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }

    scrollTolocationSection() {
      document.getElementById("location").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      }

  formInit() {
    this.enquiryForm = new FormGroup({
      property_id: new FormControl(),	
      enquiry_about:	new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),	
      email: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')]),
      message: new FormControl('', [Validators.required])
    })
  }

  getIdFromParams() {
    this.activatedRoute.params.subscribe((res)=>{
      console.log(res);
      if(res) {
        this.propertyId = this.storage.decription(res.id, 'PROPERTY_ID');
        // this.propertyId = 'zsNcyncBwwdGKtdBfv_y';
        this.propertyList = [];
        this.getPropertyDetails().then((id)=>{
          this.getClientDetailsById(id);
          this.getCMSBySlug();
          this.getPropertyList();
        });
      } else {
        this.propertyId = 'B8N-yXcBwwdGKtdB4_6G';
      }
      this.enquiryForm.patchValue({property_id: this.propertyId});
    })
  }

  getCMSBySlug() {
    this.apiService.get(`cms/contact-name`).subscribe((res: any)=>{
      if(res.status === 200) {
        this.contactDetails = res.data;
      }
    })
  }

  getClientDetailsById(id) {
    this.apiService.get(`user/getuserprofile/${id}`).subscribe((res: any)=>{
      if(res.status === 200) {
        this.clientDetails = res.data;
      }
    })
  }

  getPropertyDetails() {
    return new Promise((resolve, reject) => {
      this.es.getSingleDocument('properties', 'properties', this.propertyId)
        .then(response => {
          // console.log(response.hits.hits[0]._source);
        if (response.hits.hits.length > 0) {
          this.propertyDetails = response.hits.hits[0];
        } else {
          this.propertyDetails = {};
        }
          // this.latitude = +this.property.lat;
          // this.longitude = +this.property.long;
          // this.center = { lat: this.latitude, lng: this.longitude };
          // this.getPropertyType(this.property.property_type_id);
          // this.getPropertyStyle(this.property.property_style_id);
          // this.transform();
          resolve(this.propertyDetails._source.seller_id);
        }, error => {
          console.error(error);
        }).then(() => {
          console.log('Property fetched succesfully!');
        });
    });
  }

  getPropertyList() {
    this.es.getAllDocuments('properties', 'properties')
      .then(response => {
        response.hits.hits.map((item)=>{
          if(item._id !== this.propertyId) {
            this.propertyList.push(item);
          }
        })
      }, error => {
        console.error(error);
      }).then(() => {
        console.log('Show Property Completed!');
      });
  }

  // selectEnquiry(event, enquiry) {
  //   if(event.checked) {
  //     this.selectedEnquiryArray.push(enquiry);
  //   } else {
  //     const index = this.selectedEnquiryArray.indexOf(enquiry);
  //     this.selectedEnquiryArray.splice(index, 1);
  //   }
  //   this.enquiryForm.patchValue({enquiry_about: this.selectedEnquiryArray});
  //   // console.log(event);
  // }

  selectEnquiry(event, enquiry?) {
    this.enquiryAbourArray.forEach((item,indx)=>{
      if(enquiry.title === item.title && event.checked){
        this.selectedEnquiryArray=[];
        this.selectedEnquiryArray.push(item.title);
       }
       else{
        this.enquiryAbourArray[indx].checked = false;
       }
    })
    this.enquiryForm.patchValue({enquiry_about: this.selectedEnquiryArray});
  }

  runLoanCalculator() {
    (function(){function b(){var a=280;768>document.getElementById("ecww-widgetwrapper").offsetWidth&&(a=840);document.getElementById("ecww-widget-iframe").setAttribute("style","position:absolute;top:0;left:0;width:100%;height:100%;");document.getElementById("ecww-widget").setAttribute("style","position:relative;padding-top:0;height:0;overflow:hidden;padding-bottom:"+a+"px;")}window.onload=function(){var a=document.createElement("iframe");a.id="ecww-widget-iframe";a.scrolling="no";a.width=
"800px";a.height="280px";a.setAttribute("src","https://emicalculator.net/widget/2.0/widget.html");document.getElementById("ecww-widget").appendChild(a);b()};window.onresize=function(){b()}})();
}


  encriptAndRoute(id) {
    this.router.navigate(['/details', (this.storage.encription(id, 'PROPERTY_ID')).toString()]);
    document.getElementById("scrollToTop").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});    
  }

  submitEnquiry(data) {
    if(this.enquiryForm.valid) {
      console.log(data);
      this.apiService.post(`enquiry/send`, data).subscribe((res: any)=>{
        if(res.status === 200) {
          this.formInit();
          //this.selectedEnquiryArray = [];
           this.enquiryAbourArray.forEach((item,indx)=>{
            this.enquiryAbourArray[indx].checked = false;
           })
          this.apiService.alert(res.message, 'success');
        } else {
          this.apiService.alert(res.message, 'error');
        }
      }, err => this.apiService.alert('Something went wrong! Try again.', 'error'))
    } else {
      this.enquiryForm.markAllAsTouched();
    }
  }

  storeAndRoute(property, clientDetails) {
    const data =  {
      property_id : property._id,
      property_price: property?._source?.property_price,
      property_address: `${property?._source?.apt} ${property?._source?.address}, ${property?._source?.city_name}, ${property?._source?.state_name}, ${property?._source?.country_name} ${property?._source?.zip}`,
      clientImage: clientDetails.profile_image,
      clentFullName: clientDetails.first_name + ' ' + clientDetails.last_name,
      clentPhone: clientDetails.phone,
    }
    this.storage.setDataForEnquiry(data).then(()=>{
      this.router.navigate(['/get-in-touch']);
    });
  }

  onNavigate(keyword){
    window.open(`https://www.google.com/search?q=${keyword}`, "_blank");
}
}
