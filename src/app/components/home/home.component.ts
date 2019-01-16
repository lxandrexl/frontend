import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer  } from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
  horoscopo: any;
  tip: any;
  promo: any;
  video_ready = false;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private userService: UserService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.user = this.tokenService.GetToken();
    this.getVideosHome();
    this.helperCookie();
  }

  helperCookie() {
    this.tokenService.DeleteTimeRoom();
    this.tokenService.DeleteMinutesroom();
    this.tokenService.DeleteSecondsRoom();
  }

  getVideosHome() {
    this.userService.getVideosHome().subscribe((response) => {
      this.horoscopo = this.sanitizer.bypassSecurityTrustResourceUrl(response.data[0].url);      
      this.tip = this.sanitizer.bypassSecurityTrustResourceUrl(response.data[1].url);
      this.promo =  this.sanitizer.bypassSecurityTrustResourceUrl(response.data[2].url);
      this.video_ready = true;
    })
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
