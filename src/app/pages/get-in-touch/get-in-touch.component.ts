import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-get-in-touch',
  templateUrl: './get-in-touch.component.html',
  styleUrls: ['./get-in-touch.component.scss']
})
export class GetInTouchComponent implements OnInit {
  propertyAndClientDetails:any
  enquiryForm: FormGroup;
  selectedEnquiryArray =[];
  enquiryAbourArray = [
    {title: 'Scheduling an inspection',checked: false},
    {title: 'Price information', checked: false},
    {title: 'Rates & Fees', checked: false},
    {title: 'Similar properties', checked: false},
  ];
  imageURL: any;
  constructor(
    private storage: StorageService,
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.imageURL = environment.BASE_IMAGE_ENDPOINT;
    // console.log('Data:', this.storage.getDataForEnquiry())
     this.propertyAndClientDetails = this.storage.getDataForEnquiry();
     this.formInit();
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


  submitEnquiry(data) {
    data.property_id = this.propertyAndClientDetails.property_id;
    //console.log('enquiryAbourArray:',this.enquiryAbourArray);
    //console.log('Data:',data)
    if(this.enquiryForm.valid) {
      this.apiService.post(`enquiry/send`, data).subscribe((res: any)=>{
        if(res.status === 200) {
          this.formInit();
         // this.selectedEnquiryArray = [];
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

}
