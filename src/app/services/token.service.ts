import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private cookieService: CookieService) {}
  //CALENDAR COOKIE  
  setCalendarPrevToken(name) {
    this.cookieService.set('calendar_prev', name, 365);
  }

  setCalendarNextToken(name) {
    this.cookieService.set('calendar_next', name, 365);
  }

  getCalendarPrevToken() {
    return this.cookieService.get('calendar_prev');
  }

  getCalendarNextToken() {
    return this.cookieService.get('calendar_next');
  }

  //CULQI COOKIES
  setCookieCulqiDesc(name) {
    this.cookieService.set('culqi_description', name, 365);
  }

  setCookieCulqiPrice(name) {
    this.cookieService.set('culqi_price', name, 365);
  }

  setCookieCulqiProduct(name) {
    this.cookieService.set('culqi_name', name, 365);
  }

  setCookieCulqiEmail(name) {
    this.cookieService.set('culqi_email', name, 365);
  }

  setCookieCulqiType(name) {
    this.cookieService.set('culqi_type', name, 365);
  }

  setCookieCulqiPlan(name) {
    this.cookieService.set('culqi_plan', name, 365);
  }

  setCookieTmpName(name) {
    this.cookieService.set('profile_name', name, 1);
  }

  setCookieTmpLastname(name) {
    this.cookieService.set('profile_lastname', name, 1);
  }

  setCookieTmpTelefono(name) {
    this.cookieService.set('profile_telefono', name, 1);
  }

  setCookieTmpDireccion(name) {
    this.cookieService.set('profile_direccion', name, 1);
  }

  setCookieTmpPais(name) {
    this.cookieService.set('profile_pais', name, 1);
  }

  // ROOM TOKENS
  SetTimeRoom(time) {
    this.cookieService.set('time_room', time, 365);
  }
  SetSecondsRoom(seconds) {
    this.cookieService.set('seconds_room', seconds, 365);
  }
  SetMinutesRoom(minutes) {
    this.cookieService.set('minutes_room', minutes, 365);
  }
  GetTimeRoom() {
    return this.cookieService.get('time_room');
  }
  GetSecondsRoom() {
    return this.cookieService.get('seconds_room');
  }
  GetMinutesRoom(){
    return this.cookieService.get('minutes_room');
  }
  DeleteTimeRoom() {
    let timerom = this.cookieService.delete('time_room');
  }
  DeleteSecondsRoom() {
    let secondrom = this.cookieService.delete('seconds_room');
  }
  DeleteMinutesroom() {
    let minuterom = this.cookieService.delete('minutes_room');
  }

  // SET TOKENS
  SetToken(token) {
    this.cookieService.set('chat_token', token, 365);
  }

  SetTokenPsiquica(token) {
    this.cookieService.set('chat_token_psiquica', token, 365);
  }

  SetTokenCliente(token) {
    this.cookieService.set('cliente_token', token, 365);
  }
  
  SetPsiquicaRoom(psiquica) {
    this.cookieService.set('psiquica_name', psiquica, 365);
  }

  setTokenRoom(token) {
    this.cookieService.set('chat_room', token, 365);
  }

  // GET TOKENS

  GetToken() {
    return this.cookieService.get('chat_token');
  }

  GetTokenPsiquica() {
    return this.cookieService.get('chat_token_psiquica');
  }

  GetTokenCliente() {
    return this.cookieService.get('cliente_token');
  }

  GetPsiquicaRoom() {
    return this.cookieService.get('psiquica_name');
  }

  GetTokenRoom() {
    return this.cookieService.get('chat_room');
  }

  // DELETE TOKENS

  DeleteToken() {
    this.cookieService.delete('chat_token');
  }

  DeleteTokenPsiquica() {
    this.cookieService.delete('chat_token_psiquica');
  }

  DeleteTokenCliente() {
    this.cookieService.delete('cliente_token');
  }

  DeletePsiquicaRoom() {
    this.cookieService.delete('psiquica_name');
  }

  DeleteTokenRoom() {
    this.cookieService.delete('chat_room');
  }

  DeleteCalendarPrevToken() {
    this.cookieService.delete('calendar_prev');
  }

  DeleteCalendarNextToken() {
    this.cookieService.delete('calendar_next');
  }

  // GET PAYLOADS

  GetPayload() {
    const token = this.GetToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = JSON.parse(this.DecryptBase64UTF8(payload));
    }
    return payload.data;
  }

  GetPayloadPsiquica() {
    const token = this.GetTokenPsiquica();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = JSON.parse(this.DecryptBase64UTF8(payload));
    }
    return payload.data;
  }

  GetPayLoadCliente(token?) {
    let payload;
    if(token === '' || token === null || token === undefined) {
      token = this.GetTokenCliente();
    }
    if (token) {
      payload = token.split('.')[1];
      payload = JSON.parse(this.DecryptBase64UTF8(payload));
    }
    return payload.data;
  }

  // DECRYPT BASE 64

  DecryptBase64UTF8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
  }

  

  

  
}
