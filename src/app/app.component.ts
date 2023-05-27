import { Component, OnInit } from '@angular/core';
declare var AOS: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'default';
  constructor() { AOS.init(); }
  ngOnInit() {
    // const URL = window.URL;
    // window.addEventListener('unload', () => {
    //   console.log(2378);
    // });

  }
}
