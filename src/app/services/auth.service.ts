import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseURL } from '../globalParameters';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  registerUser(body): Observable<any> {
    return this.http.post(`${baseURL}/register`, body);
  }

  loginUser(body): Observable<any> {
    return this.http.post(`${baseURL}/login`, body);
  }

  loginPsiquica(body): Observable<any> {
    return this.http.post(`${baseURL}/loginPsiquica`,body);
  }
}
