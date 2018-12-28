import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseURL } from '../globalParameters';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getProfileByToken(body): Observable<any> {
    return this.http.post(`${baseURL}/usuario/profile`, body);
  }

  getPaquetes(idUsuario): Observable<any> {
    return this.http.post(`${baseURL}/usuario/paquetes`, idUsuario);
  }

  getDetailsZodiaco(name): Observable<any> {
    return this.http.post(`${baseURL}/usuario/details`, {name: name});
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

  UpdateRoom(cliente, room, body, endChat): Observable<any> {
    return this.http.post(`${baseURL}/usuario/UpdateRoom`, 
    {cliente: cliente, room: room, data: body, finish: endChat});
  }

  closeRoom(psiquica, tiempo, room, evaluacion, comentario): Observable<any> {
    return this.http.post(`${baseURL}/usuario/closeRoom`, 
    { 
      psiquica: psiquica,
      tiempo: tiempo,
      room: room,
      evaluacion: evaluacion,
      comentario: comentario
    });
  }

  expireRoom(room): Observable<any> {
    return this.http.post(`${baseURL}/usuario/expireRoom`, {room: room});
  }

  updateProfile(body): Observable<any> {
    return this.http.post(`${baseURL}/usuario/updateUser`, body);
  }

  getCitasUser(idUser): Observable<any> {
    return this.http.post(`${baseURL}/usuario/getCitas`, {_id: idUser});
  }

  GetCitasConfiguration(): Observable<any> {
    return this.http.get(`${baseURL}/usuario/citasConf`);
  }

}
