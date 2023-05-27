import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DefaultComponent } from 'src/app/modal';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  getInTouch(){
    const dialogRef = this.dialog.open(DefaultComponent, {
      panelClass: 'custom-modalbox',
      data:{type: 'contact'}
    });
  }

}
