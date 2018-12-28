import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;

  constructor(
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.user = this.tokenService.GetToken();
  }

  citarJos() {
    if(!this.user) 
      window.location.href="login";
    else
      window.location.href="chat-josie";
  }

  citarPsi() {
    if(!this.user) 
      window.location.href="login";
    else
      window.location.href="chat-psiquica";
  }

  suscribir() {
    if(!this.user) 
      window.location.href="login";
    else
      window.location.href="suscripcion";
  }
}
