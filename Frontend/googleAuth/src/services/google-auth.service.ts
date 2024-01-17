import { UrlConstants } from '../shared/config/url.constants';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  currentUser$ = new BehaviorSubject<any>(null);

  constructor(
    private httpClient: HttpClient,
    private urlConstants: UrlConstants,
  ) { }

  private apiUrl = this.urlConstants.baseURL + this.urlConstants.googleTokenVerify;
  // private apiUrl = 'http://127.0.0.1:8000/google_token/';

  verifyGoogleToken(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>(this.apiUrl, data, { headers });
  }

  
  set setLoginDetail(data: any) {
    localStorage.setItem("currentUser", JSON.stringify(data));
    localStorage.setItem("token", JSON.stringify(data.access));
    this.currentUser$.next(data);
  }
}
