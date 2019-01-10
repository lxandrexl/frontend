import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;

  constructor(
    private tokenService: TokenService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.tokenService.GetToken();
  }

  citarJos() {
    if(!this.user) 
      this.router.navigate(['/login']);
      //window.location.href="login";
    else
      this.router.navigate(['/chat-josie']);
      //window.location.href="chat-josie";
  }

  citarPsi() {
    if(!this.user) 
      this.router.navigate(['/login']);
      //window.location.href="login";
    else
    this.router.navigate(['/chat-psiquica']);
      //window.location.href="chat-psiquica";
  }

  suscribir() {
    if(!this.user) 
      this.router.navigate(['/login']);
      //window.location.href="login";
    else
      this.router.navigate(['/suscripcion']);
      //window.location.href="suscripcion";
  }
}
