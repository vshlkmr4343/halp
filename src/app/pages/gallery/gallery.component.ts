import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DefaultComponent } from 'src/app/modal';
import { ElasticsearchService } from 'src/app/services/elasticsearch.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
 propertyId:any;
  propertyDetails: any;
  constructor(
    private es: ElasticsearchService,
    private dialog : MatDialog,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
   if(this.route.snapshot.paramMap.get('id')){
     this.propertyId = this.route.snapshot.paramMap.get('id');
     this.es.getSingleDocument('properties', 'properties', this.propertyId)
     .then(response => {
     if (response.hits.hits.length > 0) {
       this.propertyDetails = response.hits.hits[0];
     } else {
       this.propertyDetails = {};
     }
     console.log('propertyDetails:',this.propertyDetails);
      
     }, error => {
     }).then(() => {
     });
   }
  }

  openModal(val) {
    let dataVal:any= this.propertyDetails._source;
    dataVal['selected'] = val;
    const dialogRef = this.dialog.open(DefaultComponent, {
      panelClass: 'custom-modalbox',
      data: dataVal
    });
  }
}
