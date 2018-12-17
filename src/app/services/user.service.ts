import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseURL } from '../globalParameters';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getPaquetes(idUsuario): Observable<any> {
    return this.http.post(`${baseURL}/usuario/paquetes`, idUsuario);
  }
  
  getPsiquicas(): Observable<any> {
    return this.http.get(`${baseURL}/psiquica/all`);
  }

  llamarPsiquica(idPsiquica): Observable<any> {
    return this.http.post(`${baseURL}/usuario/llamar`, idPsiquica);
  }

  sendMessage(message, sender, room): Observable<any> {
    return this.http.post(`${baseURL}/usuario/sendMessage`,{message, sender, room});
  }

  getMessages(room): Observable<any> {
    return this.http.post(`${baseURL}/usuario/getMessages`, {room: room});
  }

}
