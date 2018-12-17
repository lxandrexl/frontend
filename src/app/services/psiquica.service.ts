import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseURL } from '../globalParameters';

@Injectable({
  providedIn: 'root'
})
export class PsiquicaService {

  constructor(private http: HttpClient) { }

  closeSession(body): Observable<any> {
    return this.http.post(`${baseURL}/psiquica/closeSession`, body);
  }
  
  updateStatus(body): Observable<any> {
    return this.http.post(`${baseURL}/psiquica/updateStatus`, body);
  }

  makeRoom(body): Observable<any> {
    return this.http.post(`${baseURL}/psiquica/makeRoom`, body);
  }

  sendMessage(message, sender, room): Observable<any> {
    return this.http.post(`${baseURL}/psiquica/sendMessage`,{message, sender, room});
  }

  getMessages(room): Observable<any> {
    return this.http.post(`${baseURL}/psiquica/getMessages`, {room: room});
  }

  closeRoom(psiquica, room, tiempo, evaluacion, comentario): Observable<any> {
    return this.http.post(`${baseURL}/psiquica/closeRoom`, 
    { 
      psiquica: psiquica,
      room: room,
      tiempo: tiempo,
      evaluacion: evaluacion,
      comentario: comentario
    });
  }

}
