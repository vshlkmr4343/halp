import { Injectable, Optional } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, exhaust } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { EventService } from './event.service';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_URL: string;
  httpOptions: { headers: HttpHeaders; };
  TOKEN: string;
  ROLE: string;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private event: EventService,
    private router: Router
  ) {
    this.API_URL = environment.BASE_API_ENDPOINT;
    this.TOKEN = this.storage.getDataField('token');
    this.ROLE = this.storage.getDataField('role');

    this.router.events.subscribe((res: any) => {
      if (res instanceof NavigationEnd || res instanceof NavigationStart) {
        this.TOKEN = this.storage.getDataField('token');
        this.ROLE = this.storage.getDataField('role');
        this.setHeader();
      }
    });
    this.event.isLogin.subscribe((res: boolean) => {
      this.TOKEN = this.storage.getDataField('token');
      this.ROLE = this.storage.getDataField('role');
      this.setHeader();
    });
  }



  private formatErrors(error: any) {
    return throwError(error.error);
  }

  setHeader() {
    if (this.TOKEN !== undefined) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'multipart/form-data',
          'x-access-token': this.TOKEN
        })
      };
    } else {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'multipart/form-data',
        })
      };
    }
  }


 get(path: string, params: HttpParams = new HttpParams()) {
    return this.http.get(`${this.API_URL}${path}`, { headers: this.httpOptions.headers, params })
      .pipe(catchError(this.formatErrors));
  }

  post(path: any, body: object = {}) {
    return this.http.post(`${this.API_URL}${path}`, body, { headers: this.httpOptions.headers }).pipe(catchError(this.formatErrors));
  }

  postMultiData(path: string, file: FormData): Observable<any> {
    const httpOptionsimg = {
      headers: new HttpHeaders({
        Accept: 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + this.TOKEN
      // 'x-access-token': this.TOKEN
      })
    };
    return this.http.post(`${this.API_URL}${path}`, file,  httpOptionsimg).pipe(catchError(this.formatErrors));
  }

  patch(path: any, body: object = {}) {
    return this.http.patch(`${this.API_URL}${path}`, body, { headers: this.httpOptions.headers }).pipe(catchError(this.formatErrors));
  }

  put(path: any, body: object = {}) {
       return this.http.put(`${this.API_URL}${path}`, body, { headers: this.httpOptions.headers }).pipe(catchError(this.formatErrors));
  }

  delete(path: string, alert: boolean = false, params: HttpParams = new HttpParams()) {
    return this.http.delete(`${this.API_URL}${path}`, { headers: this.httpOptions.headers, params }).pipe(catchError(this.formatErrors));
  }

  upload(path: any, body: FormData) {
    return this.http.put(`${this.API_URL}${path}`, body, this.httpOptions).pipe(catchError(this.formatErrors));
  }


  alert(message: string, type: any) {
    return Swal.fire({
      title: message,
      icon: type,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
    });
  }

  // post(path: any, body: object = {}): Observable<any> {
  //   return this.http.post(
  //     `${this.apiURL}${path}`,
  //     body
  //   ).pipe(catchError(this.formatErrors));
  // }

  // postx(path: string, body: object = {}): Observable<any> {
  //   const httpOptionsuser = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'x-access-token': this.token
  //     })
  //   };
  //   return this.http.post(
  //     `${this.apiURL}${path}`,
  //     body,
  //     httpOptionsuser
  //   ).pipe(catchError(this.formatErrors));
  // }

  // put(path: string, body: object = {}): Observable<any> {
  //   return this.http.put(
  //     `${this.apiURL}${path}`,
  //     body
  //   ).pipe(catchError(this.formatErrors));
  // }

  // putx(path: string, body: object = {}): Observable<any> {
  //   const httpoptionuser = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'x-access-token': this.token
  //     })
  //   };
  //   return this.http.put(
  //     `${this.apiURL}${path}`, body, httpoptionuser).pipe(catchError(this.formatErrors));
  // }

  // deletex(path: string, params: HttpParams = new HttpParams()): Observable<any> {
  //   const httpoptionuser = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       // 'x-access-token': this.storage.getUserToken()
  //     })
  //   };
  //   return this.http.delete(`${this.apiURL}${path}`, httpoptionuser)
  //     .pipe(catchError(this.formatErrors));
  // }

  // postMultiData(path: string, file: FormData): Observable<any> {
  //   const httpOptionsimg = {
  //     headers: new HttpHeaders({
  //       Accept: 'multipart/form-data'
  //     })
  //   };
  //   return this.http.post(`${this.apiURL}${path}`, file, httpOptionsimg).pipe(catchError(this.formatErrors));
  // }

  // postFile(path: string, file: FormData): Observable<any> {
  //   const httpOptionsFile = {
  //     headers: new HttpHeaders({
  //       Accept: 'application/json, text/plain'
  //     })
  //   };
  //   return this.http.post(`${this.apiURL}${path}`, file, httpOptionsFile).pipe(catchError(this.formatErrors));
  // }




}
