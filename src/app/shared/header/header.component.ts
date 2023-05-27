import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean;
  username: string;
  constructor(
    private event: EventService,
    private storage: StorageService
  ) {
    this.event.isLogin.subscribe((res: boolean) => {
      this.isLoggedIn = res;
      this.username = this.storage.getDataField('username');
      console.log(this.username);
    });
  }

  ngOnInit(): void {
  }
  logout() {
    this.storage.clearUser();
    this.event.setLoginEmmit(false);
  }

  openMenu() {
    document.querySelector('.menuBackDrop').classList.add('active');
    document.querySelector('.mainMenuWrap').classList.add('active');
  }
  closeMenu() {
    document.querySelector('.menuBackDrop').classList.remove('active');
    document.querySelector('.mainMenuWrap').classList.remove('active');
  }
}
