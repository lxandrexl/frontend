import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as M from 'materialize-css';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  payload: any;
  sessionStatus = false;
  id_usuario: any;
  userNavbar= '';
  minutosPsiquica = 0;
  citasPsiquica = 0;
  roomStatus = false;
  onRoom = false;
  timerInput1 = '';
  timerInput2 = '';
  DataContainer: any;
  @Output() ChatData = new EventEmitter<any>();

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private route: Router
   ) { }

  ngOnInit() {
    this.verifyTokenSession();
    this.verifyChatRoom();
    this.DropDown();
    this.NabMobile();
  }

  verifyChatRoom() {
    const room = this.tokenService.GetTokenRoom();
    if(!room) return;

    if(this.route.url === '/private-room') this.onRoom = true;

    this.initTimerClient(this.payload.min_psiquica);
    this.roomStatus = true;
  }

  initTimerClient(timeClient) {
    let secondAbsolute = 0;
    let minutes = timeClient;
    let seconds = 0;
    let tmpMin = '';
    let tmpSec = '';
    let timer = setInterval( () => {
      if(seconds == 0 && minutes == 0)  clearInterval(timer);
      
      secondAbsolute++;
      seconds--;
      if( seconds < 0) {
        seconds = 59;
        minutes--;
      }
      if(seconds < 10)  tmpSec = '0' + seconds.toString();
      else  tmpSec = seconds.toString();

      if(minutes < 10)  tmpMin = '0' + minutes.toString();
      else  tmpMin = minutes.toString();

      this.timerInput1 = tmpMin + ':' + tmpSec;
      this.timerInput2 = tmpMin + ':' + tmpSec;

      this.DataContainer = {
        minutesRoom: parseInt(tmpMin),
        secondsRoom: parseInt(tmpSec),
        timeTotal: secondAbsolute
      }
    },1000);
  }

  TerminarChat() {
    this.ChatData.emit(this.DataContainer);
  }

  DropDown() {
    document.addEventListener('DOMContentLoaded', function() {
      let elems = document.querySelectorAll('.dropdown-trigger');
      M.Dropdown.init(elems, {
        alignment: 'right',
      coverTrigger: false
      });
    });
  }

  NabMobile() {
    document.addEventListener('DOMContentLoaded', function() {
      let elems = document.querySelectorAll('.sidenav');
      M.Sidenav.init(elems, {});
    });
  }

  RedirectLogin() {
    window.location.href= `/login`;
  }

  RedirectHome() {
    window.location.href= ``;
  }

  verifyTokenSession() {
    let token = this.tokenService.GetToken();
    if(token === null || token === '')
        this.sessionStatus = false;
    else
      this.sessionStatus = true;
      
    if(this.sessionStatus) {
      this.payload = this.tokenService.GetPayload();
      this.userNavbar = this.payload.nombre + ' ' + this.payload.apellido_paterno;
      this.id_usuario = this.payload.id_usuario;
      this.getPaquetes({_id: this.id_usuario});
    }
  }

  getPaquetes(codigoUsuario) {
    this.userService.getPaquetes(codigoUsuario).subscribe( res => {
      this.minutosPsiquica = res.data.min_psiquica;
      this.citasPsiquica = res.data.citas_josie;
    }, err => console.log(err));
  }

  destroyTokenSession() {
    this.tokenService.DeleteToken();
    location.reload();
  }



}
