import { Injectable } from '@angular/core';
import * as CryptoTS from 'crypto-ts';
import { CookieService } from 'ngx-cookie-service';
import { promise } from 'protractor';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  TEMP = {
    KEY: '_tk',
    PASSWORD: '90590348534YYIU!@00'
  };
  USER = {
    KEY: '_tuL',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  constructor(
    private cookie: CookieService
  ) { }


  encription(data: any, secret: string) {
    return CryptoTS.AES.encrypt(JSON.stringify(data), secret);
  }

  decription(data: any, secret: string) {
    const bytes = CryptoTS.AES.decrypt(data.toString(), secret);
    return JSON.parse(bytes.toString(CryptoTS.enc.Utf8));
  }

  setTempData(ID: string) {
    return this.cookie.set(this.TEMP.KEY, this.encription(ID, this.TEMP.PASSWORD).toString());
  }
  getTempData() {
    const DATA = this.cookie.get(this.TEMP.KEY) !== null ? this.cookie.get(this.TEMP.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.TEMP.PASSWORD);
    } else {
      return undefined;
    }
  }
  clearTempData() {
    return this.cookie.delete(this.USER.KEY);
  }

  setUser(data: any) {
    return this.cookie.set(this.USER.KEY, this.encription(data, this.USER.PASSWORD).toString());
  }
  getUser() {
    const DATA = this.cookie.get(this.USER.KEY) !== null ? this.cookie.get(this.USER.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.USER.PASSWORD);
    } else {
      return undefined;
    }
  }

  clearUser() {
    return this.cookie.delete(this.USER.KEY);
  }
  // TOKEN
  getDataField(type: string) {
    if (this.getUser() !== undefined && this.getUser()[type] !== undefined) {
      return this.getUser()[type];
    } else {
      return undefined;
    }
  }

  isAuthenticate() {
    if (this.getDataField('token') !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  setDataForEnquiry(data: any) {
    return new Promise((resolve, reject)=>{
      this.cookie.set('DataForEnquiry', this.encription(data, 'DataForEnquiry').toString());
      resolve('');
    });
  }

  getDataForEnquiry() {
    const DATA = this.cookie.get('DataForEnquiry') !== null ? this.cookie.get('DataForEnquiry') : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, 'DataForEnquiry');
    } else {
      return undefined;
    }
  }
  clearDataForEnquiry() {
    return this.cookie.delete(this.USER.KEY);
  }

  setDataForSearch(data: any) {
    return new Promise((resolve, reject)=>{
      this.cookie.set('homeSearchData', this.encription(data, 'homeSearchData').toString());
      resolve('');
    });
  }

  getDataForSearch() {
    const DATA = this.cookie.get('homeSearchData') !== null ? this.cookie.get('homeSearchData') : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, 'homeSearchData');
    } else {
      return undefined;
    }
  }
  clearDataForSearch() {
    return this.cookie.delete(this.USER.KEY);
  }
}
