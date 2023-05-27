import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
  termsAndConditionData:any;
  content: any;
  constructor(public apiservice: ApiService) { }
  ngOnInit(): void {
    this.apiservice.get(`cms/terms-and-conditions`).subscribe((res:any)=>{
      this.termsAndConditionData = res.data;
      this.content = this.termsAndConditionData?.content;
      this.content = this.content.substring(0,504)+'...';
    })
  }

more(){
  if(this.content.length === 507){
    this.content = this.termsAndConditionData?.content;
  }
  else{
    this.content = this.content.substring(0,504)+'...';
  }
}

}
