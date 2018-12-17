import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private cookieService: CookieService) {}

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
    return this.cookieService.delete('cliente_token');
  }

  DeleteTokenRoom() {
    return this.cookieService.delete('chat_room');
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
