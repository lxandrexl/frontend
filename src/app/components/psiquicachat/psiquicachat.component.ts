import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { socketURL } from '../../globalParameters';
import io from 'socket.io-client';
import { TokenService } from '../../services/token.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-psiquicachat',
  templateUrl: './psiquicachat.component.html',
  styleUrls: ['./psiquicachat.component.css']
})
export class PsiquicachatComponent implements OnInit {
  myToken: any;
  psiquicas = [];
  socket: any;
  psiquica = [];
  psiquica_status = false;
  status_llamada = false;
  paquetes = [];

  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) { 
    this.socket = io(socketURL);
  }

  ngOnInit() {
    this.myToken = this.tokenService.GetToken();
    this.GetPsiquicas();  
    this.listenSockets();
  }

  GetPsiquicas() {
    this.userService.getPsiquicas().subscribe( response => {
      this.psiquicas = response.result;
    }, err => console.log(err));
  }

  GetPaquetes(event) {
    this.paquetes = event;
  }

  openDescription(psiquica) {
    this.psiquica = psiquica;
    let descContainer = document.getElementsByClassName('containerDescription') as HTMLCollectionOf<HTMLElement>;
    descContainer[0].style.display = 'block';
    this.psiquica_status = true;
  }

  closeDescription() {
    let descContainer = document.getElementsByClassName('containerDescription') as HTMLCollectionOf<HTMLElement>;
    descContainer[0].style.display = 'none';
    this.psiquica_status = false;
  }
  
  showLlamadaProceso() {
    let descContainer = document.getElementsByClassName('shadowContainerLlamada') as HTMLCollectionOf<HTMLElement>;
    descContainer[0].style.display = 'block';
  }

  closeLlamadaProceso() {
    let descContainer = document.getElementsByClassName('shadowContainerLlamada') as HTMLCollectionOf<HTMLElement>;
    descContainer[0].style.display = 'none';
  }

  iniciarLlamada(psiquica) {
    if(psiquica.estado == 1){
      const _id = psiquica.id_psiquica;
      this.userService.llamarPsiquica({_id: _id}).subscribe( response => {
        if(!response.message) return
        this.psiquica = response.psiquica;
        this.socket.emit('refreshPsiquicas', {message: 'Hey, updated...'});
        this.socket.emit('llamar_psiquica', {psiquica: _id, usuario: this.myToken});
        this.closeDescription();
        this.showLlamadaProceso();
      }, err => console.log(err));
    } else {
      swal('Psiquica en llamada...','Por favor intente con otra.', 'info');
    }
  }
  
  listenSockets() {
    this.socket.on('refreshPsiquicasList', response => { this.GetPsiquicas(); });
    this.socket.on('cancelo_llamada', data => {
      this.psiquica = data.psiquica;
      if(this.myToken == data.token) {
        this.closeLlamadaProceso();
        swal('La psiquica no pudo contestar la llamada...', 'Por favor intente nuevamente.', 'info');
      }
    });
    this.socket.on('llamada_aceptada', data => {
      if(this.myToken != data.clienteToken) return

      this.tokenService.SetPsiquicaRoom(data.psiquicaId);
      this.tokenService.setTokenRoom(data.chatToken);
      window.location.href='private-room';
    })
  }

  redirectShop() {
    window.location.href = 'compras';
  }
}
