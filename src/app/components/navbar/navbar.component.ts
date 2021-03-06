import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as M from 'materialize-css';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import io from 'socket.io-client';
import { socketURL } from '../../globalParameters';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  socket: any;
  payload: any;
  sessionStatus = false;
  id_usuario: any;
  userNavbar = '';
  minutosPsiquica = 0;
  citasPsiquica = 0;
  roomStatus = false;
  onRoom = false;
  timerInput1 = '';
  timerInput2 = '';
  DataContainer: any;
  secondAbsolute = 0;
  navBarContent: any;
  navBarBody: any;

  @Output() globalPaquetes = new EventEmitter<any>();
  @Output() ChatData = new EventEmitter<any>();
  timer: any;

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router,
  ) {
    this.socket = io(socketURL);
  }

  ngOnInit() {
    this.verifyTokenSession();
    this.DropDown();
    this.NabMobile();
    this.socket.on('continue_timer', data => { this.initTimerClient() });
    this.socket.on('refresh', data => {
      if (this.tokenService.GetToken() === data) this.verifyTokenSession();
    });
    this.socket.on('reservo_cita', data => {
      if (this.tokenService.GetToken() == data.token) {
        this.verifyTokenSession();
      }
    });
  }

  verifyChatRoom() {
    const room = this.tokenService.GetTokenRoom();
    if (!room) return;

    this.socket.emit('entrar_chat_cliente', { roomToken: this.tokenService.GetTokenRoom() });
    if (this.router.url === '/private-room') this.onRoom = true;
    this.secondAbsolute = parseInt(this.tokenService.GetTimeRoom());
    this.initTimerClient();
    this.roomStatus = true;
  }

  initTimerClient() {
    let minutes = parseInt(this.tokenService.GetMinutesRoom());
    let seconds = parseInt(this.tokenService.GetSecondsRoom());
    let tmpMin = '';
    let tmpSec = '';
    this.timer = setInterval(() => {
      this.secondAbsolute++;
      if (seconds == 0 && minutes == 0) {
        clearInterval(this.timer);
        this.socket.emit('expire_time', { room: this.tokenService.GetTokenRoom() });
        this.timerInput1 = '00:00';
        this.timerInput2 = '00:00';
        tmpMin = '0';
        tmpSec = '0';
      } else {
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (seconds < 10) tmpSec = '0' + seconds.toString();
        else tmpSec = seconds.toString();

        if (minutes < 10) tmpMin = '0' + minutes.toString();
        else tmpMin = minutes.toString();

        this.timerInput1 = tmpMin + ':' + tmpSec;
        this.timerInput2 = tmpMin + ':' + tmpSec;
      }
      this.tokenService.SetTimeRoom(this.secondAbsolute);
      this.tokenService.SetMinutesRoom(minutes);
      this.tokenService.SetSecondsRoom(seconds);

      this.socket.emit('match_time_room', { roomToken: this.tokenService.GetTokenRoom(), timeRoom: this.tokenService.GetTimeRoom() });

      this.DataContainer = {
        minutesRoom: parseInt(tmpMin),
        secondsRoom: parseInt(tmpSec),
        timeTotal: this.secondAbsolute,
        paquetePsiquicaActual: this.minutosPsiquica,
        paqueteJosieActual: this.citasPsiquica
      }
      this.ChatData.emit(this.DataContainer);
    }, 1000);
  }

  TerminarChat() {
    clearInterval(this.timer);
    this.DataContainer.end = 'clicked';
    this.ChatData.emit(this.DataContainer);
  }

  DropDown() {
    document.addEventListener('DOMContentLoaded', function () {
      let elems = document.querySelectorAll('.dropdown-trigger');
      M.Dropdown.init(elems, {
        alignment: 'right',
        coverTrigger: false
      });
    });
  }

  NabMobile() {
    document.addEventListener('DOMContentLoaded', function () {
      let elems = document.querySelectorAll('.sidenav');
      M.Sidenav.init(elems, {});
    });
  }

  RedirectLogin() {
    this.router.navigate(['/login']);
    //window.location.href = `/login`;
  }

  RedirectHome() {
    this.router.navigate(['/']);
    //window.location.href = ``;
  }

  verifyTokenSession() {
    let token = this.tokenService.GetToken();
    if (token === null || token === '')
      this.sessionStatus = false;
    else
      this.sessionStatus = true;

    if (this.sessionStatus) {
      this.userService.getProfileByToken(this.tokenService.GetPayload())
        .subscribe(response => {
          this.payload = response.data;
          this.userNavbar = this.payload.nombre + ' ' + this.payload.apellido_paterno;
          this.id_usuario = this.payload.id_usuario;
          this.getPaquetes({ _id: this.id_usuario });
        });
    }
  }

  getPaquetes(codigoUsuario) {
    this.userService.getPaquetes(codigoUsuario).subscribe(res => {
      this.minutosPsiquica = res.data.min_psiquica;
      this.citasPsiquica = res.data.citas_josie;
      this.globalPaquetes.emit(res.data);
      this.verifyChatRoom();
    }, err => console.log(err));
  }

  destroyTokenSession() {
    this.tokenService.DeleteToken();
    this.tokenService.DeleteCalendarPrevToken();
    this.tokenService.DeleteCalendarNextToken();
    location.reload();
  }

  PsiquicaRoom() {
    return this.tokenService.GetPsiquicaRoom();
  }

  routerAction(name) {
    this.router.navigate([`/${name}`]);
  }

  showMovileNavbar() {
    this.navBarContent = document.getElementById("nav_movile_content");
    this.navBarContent.style.display = 'block';
  }

  hideMovileNavbar() {
    this.navBarBody = document.getElementById("nav_movile_content");
    this.navBarContent.style.display = 'none';
  }
}
