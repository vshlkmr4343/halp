import { Options } from '@angular-slider/ngx-slider';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { ApiService } from 'src/app/services/api.service';
import { ElasticsearchService } from 'src/app/services/elasticsearch.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  minValue: number = 0;
  maxValue: number = 250;
  minPriceValue: number = 0;
  maxPriceValue: number = 100000;
  minSizeValue: number = 0;
  maxSizeValue: number = 100000;
  bedroomArray = ['All', '1', '2', '3', '4+'];
  bathArray = ['All', '1', '2', '3', '4+'];
  garageArray = ['All', '0', '1', '2', '3', '4+'];
  livingArray = ['All', '1', '2', '3', '4+'];
  floorArray = ['All', '1', '2', '3', '4+'];


  options: Options = {
    floor: 0,
    ceil: 99999,
    getSelectionBarColor: () => { return '#001149'},
    getPointerColor: () => { return '#bf1993'},
    translate: () => {return ''}
  };
  sizeOptions: Options = {
    floor: 0,
    ceil: 4000,
    getSelectionBarColor: () => { return '#001149'},
    getPointerColor: () => { return '#bf1993'},
    translate: () => {return ''}
  };
  isChecked: boolean = true;
  toggleDropdown: boolean = false;
  inclusionToggle: boolean = false;
  gridListView: boolean = false;
  propertyList: any;
  filterObject : any;
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  homeTypeList: any;
  amenitiesList: any;
  sortData: any[];
  searchDropdownData: any;

  constructor(
    private es: ElasticsearchService,
    private apiService: ApiService,
    private storage: StorageService,
    private router: Router,  
  ) {
    this.sortData = [];
    this.filterObject = {
        bed: '',
        bath: '',
        garage: '',
        living_space: '',
        floors: '',
        city_name:  this.storage.getDataForSearch().city_name ?  this.storage.getDataForSearch().city_name : '',
        property_dev_type: '',
        home_type: this.storage.getDataForSearch().home_type ?  this.storage.getDataForSearch().home_type : '',
        property_price: ['0', '99999'],
        lot_size: ['0', '4000'],
        property_amenities: [],
        property_name: ''
      };
    }

  ngOnInit(): void {
    // this.getPropertyList();
    this.getFilteredData(this.filterObject);

    this.getAllHomeType();
    this.getAllAmenities();
    this.getSearchDropdowndata();
  }

  // if (event.value === 'default') {
  //   this.sortData = [];
  //   this.getFilteredData(this.dataSet);
  // } else if (event.value === 'Newest') {
  //   this.sortData[0] = { createdAt: { order: 'desc' } };
  //   this.getFilteredData(this.dataSet);
  // } else if (event.value === 'Oldest') {
  //   this.sortData[0] = { createdAt: { order: 'asc' } };
  //   this.getFilteredData(this.dataSet);
  // } else if (event.value === 'PriceDesc') {
  //   this.sortData[0] = { price: { order: 'desc' } };
  //   this.getFilteredData(this.dataSet);
  // } else if (event.value === 'PriceAsc') {
  //   this.sortData[0] = { price: { order: 'asc' } };
  //   this.getFilteredData(this.dataSet);
  // }

  getAllHomeType() {
    this.apiService.get(`hometype/all`).subscribe((res: any)=>{
      if(res.status === 200) {
        this.homeTypeList = res.data;
      }
    })
  }

  getAllAmenities() {
    this.apiService.get(`amenities/all`).subscribe((res: any)=>{
      if(res.status === 200) {
        this.amenitiesList = res.data;
      }
    })
  }

  searchByPropertyName(tagName, keyword) {
    this.filterObject[tagName] = '*' + keyword + '*';
    this.getFilteredData(this.filterObject);
  }

  encriptAndRoute(id) {
    const d = this.storage.encription(id, 'PROPERTY_ID')
    console.log(this.storage.decription(d, 'PROPERTY_ID'))
    this.router.navigate(['/details', (this.storage.encription(id, 'PROPERTY_ID')).toString()]);
  }

  changeAmenities(event, childId) {
    if(event.checked) {
      this.filterObject.property_amenities.push(childId);
    } else{
      const index = this.filterObject.property_amenities.indexOf(childId);
      this.filterObject.property_amenities.splice(index, 1);
    }
    this.getFilteredData(this.filterObject);
  }

  toggleSearch() {
    if (!this.toggleDropdown) this.toggleDropdown = true;
    else this.toggleDropdown = false;
  }

  toggleInclusion() {
    if (!this.inclusionToggle) this.inclusionToggle = true;
    else this.inclusionToggle = false;
  }

  selectFormList(tagname, data) {
    if(data !== 'All') {
      this.filterObject[tagname] = data;
    } else {
      this.filterObject[tagname] = '';
    }
    this.getFilteredData(this.filterObject);
  }

  viewChange() {
    if (!this.gridListView) this.gridListView = true;
    else this.gridListView = false;
  }

  getPropertyList() {
    this.es.getAllDocuments('properties', 'properties')
      .then(response => {
        this.propertyList = response.hits.hits;
      }, error => {
        console.error(error);
      }).then(() => {
        console.log('Show Property Completed!');
      });
  }

  public handleAddressChange(address: any) {
    // Do some stuff
    console.log(address)
    if(address) {
    this.filterObject.city_name = address.name;
    this.getFilteredData(this.filterObject);
}

}

changeSelect(tagname, data) {
  this.filterObject[tagname] = data;
  this.getFilteredData(this.filterObject);
}

sortDataFromSelection(event) {
  if (event.value === '') {
    this.sortData = [];
    this.getFilteredData(this.filterObject);
  } else if (event.value === 'Newest') {
    this.sortData[0] = { updatedAt: { order: 'desc' } };
    this.getFilteredData(this.filterObject);
  } else if (event.value === 'Oldest') {
    this.sortData[0] = { updatedAt: { order: 'asc' } };
    this.getFilteredData(this.filterObject);
  } else if (event.value === 'PriceDesc') {
    this.sortData[0] = { "property_price.keyword": { order: 'desc' } };
    this.getFilteredData(this.filterObject);
  } else if (event.value === 'PriceAsc') {
    this.sortData[0] = { "property_price.keyword": { order: 'asc' } };
    this.getFilteredData(this.filterObject);
  }
}

getSearchDropdowndata(){
  this.apiService.get(`dropdown/list`).subscribe((resp:any)=>{
    this.searchDropdownData = resp.data;
    // console.log(this.searchDropdownData);
    
  })
}

getFilteredData(dataSet: any) {
  let data = [];
  data = [{
    query_string: {
      analyze_wildcard: true,
      query: ''
    }
  }];
  for (const key in dataSet) {
    if (dataSet[key].length > 0) {
      console.log(key)
      if (key === 'property_amenities') {
        console.log(dataSet[key]);
        // data.query_string.fields.push(key);
        dataSet[key].map((item) => {
          // tslint:disable-next-line: max-line-length
          data[0].query_string.query =
            data[0].query_string.query.length > 0 ?
              `${data[0].query_string.query} AND (${key} : ${item})` :
              `(${key} : ${item})`;
        });

      }
        if (key === 'property_price') {
        const rangeData = {
          range: {
            [key]: {
              gte: dataSet[key][0],
              lte: dataSet[key][1]
            }
          }
        };
        data.push(rangeData);
      } else if (key !== 'property_price' && key !== 'lot_size' && key !== 'property_amenities') {
        // data.query_string.fields.push(key);
          data[0].query_string.query =
          data[0].query_string.query.length > 0 ?
            `${data[0].query_string.query} AND (${key} : ${dataSet[key]})` :
            `(${key} : ${dataSet[key]})`;

      }
    }
  }
  //     console.log(JSON.stringify(dataSet));
  //     console.log(JSON.stringify(this.sortData));
    data[0].query_string.query.trim().length === 0 ? data[0].query_string.query = '(isDeleted: false)' : '';
    this.es.getfilteredData('properties', 'properties', data, this.sortData).then((res) => {
      if (res) {
        // console.log(res);
        const dataWithLatLong = {
          data: res.hits.hits,
          // lat_long: this.latLongData,
          zoom: 4
        };
        this.propertyList = res.hits.hits;
      }
    });
}

ngOnDestroy() {
  this.storage.clearDataForSearch();
}

}
