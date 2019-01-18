import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import * as M from 'materialize-css';
import io from 'socket.io-client';
import { socketURL, audioURL } from '../../globalParameters';
import { PsiquicaService } from '../../services/psiquica.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  socket: any;
  psiquica = [];
  psiquicaNombre: string;
  psiquicaCod: string;
  chatForm: FormGroup;
  clienteData = [];
  clienteStatus = false;
  clienteToken: any;
  audio = new Audio();
  intervalTimer: any;
  valInput: string = '';
  chatContent = [];
  chatStatus = false;
  timeRoom = 0;
  timerInput1 = '';
  timerInput2 = '';
  intervalTimerChat: any;
  initTimerChat: boolean = false;

  citaJosieReg: any = [];
  audioStatus = false;
  audioChunks: any = [];
  rec: any;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private psiquicaservice: PsiquicaService,
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.socket = io(socketURL);
  }

  ngOnInit() {
    this.askPermissions();
    this.validarChatRoom();
    this.listenSocket();
    this.NabMobile();
    this.init();
    this.psiquica = this.tokenService.GetPayloadPsiquica();
    this.psiquicaNombre = this.psiquica['usuario'];
    this.psiquicaCod = this.psiquica['id_psiquica'];
    this.onlyJosie();
  }

  listenSocket() {
    this.socket.on('llamada_cliente', data => {
      this.validarPsiquica(data.psiquica, data.usuario);
    });

    this.socket.on('recibir_mensaje', data => {
      //UPDATE LISTADO CHAT
      this.getMessages();
    });

    this.socket.on('end_chat', data => {
      this.tokenService.DeleteTokenCliente();
      this.tokenService.DeleteTokenRoom();
      this.psiquicaservice.updateStatus(this.tokenService.GetPayloadPsiquica())
        .subscribe(response => {
          if (response.message) {
            swal('El chat finalizo', '', 'info')
              .then(() => {
                this.router.navigateByUrl('/loginpsiquica', { skipLocationChange: true })
                  .then(() =>
                    this.router.navigate(["lobby"])
                  );
              })
          }
        }, err => console.log(err));
    })

    this.socket.on('end_chat_system', data => {
      swal('El tiempo del usuario expiro.', '', 'info')
        .then(val => {
          this.tokenService.DeleteTokenCliente();
          this.tokenService.DeleteTokenRoom();
          this.psiquicaservice.updateStatus(this.tokenService.GetPayloadPsiquica())
            .subscribe(response => {
              if (response.message) {
                this.router.navigateByUrl('/loginpsiquica', { skipLocationChange: true })
                  .then(() =>
                    this.router.navigate(["lobby"])
                  );
              }
            }, err => console.log(err));
        })
    })

    this.socket.on('match_time', data => {
      if (this.tokenService.GetTokenRoom() != data.roomToken) return;

      this.timeRoom = data.timeRoom;
      if (!this.initTimerChat) clearInterval(this.intervalTimerChat);
      this.initTimer();
      this.initTimerChat = true;
    })
  }

  getMessages() {
    this.psiquicaservice.getMessages(this.tokenService.GetTokenRoom())
      .subscribe(response => {
        this.chatContent = response.data;
        if (this.psiquicaNombre != 'JOSIE') this.timeRoom = parseInt(response.timeRoom);
        this.initTimer();
      }, err => console.log(err));
  }

  evalTypeMessage(message) {
    if (message.includes('.ogg')) {
      return `<audio controls>
        <source src="${audioURL}${message}" type="audio/ogg">
        Your browser does not support the audio tag.
      </audio>`;
    } else {
      return message;
    }
  }

  validarChatRoom() {
    if (!this.tokenService.GetTokenCliente()) return

    this.clienteData = this.tokenService.GetPayLoadCliente();
    this.socket.emit('entrar_chat_psiquica', { roomToken: this.tokenService.GetTokenRoom() });
    this.valInput = 'validated';
    this.chatStatus = true;
    this.getMessages();
    console.log('inicia chat!');
  }

  initTimer() {
    if (this.initTimerChat) return;

    let secondAbsolute = this.timeRoom;
    let minutes = 0;
    let seconds = this.timeRoom;
    let tmpSec = '';
    let tmpMin = '';
    if (seconds >= 60) {
      minutes = Math.trunc(seconds / 60);
      seconds = seconds % 60;
    }
    this.intervalTimerChat = setInterval(() => {
      secondAbsolute++;
      seconds++;
      if (seconds == 60) {
        seconds = 0;
        minutes++;
      }
      if (seconds < 10) tmpSec = '0' + seconds.toString();
      else tmpSec = seconds.toString();

      if (minutes < 10) tmpMin = '0' + minutes.toString();
      else tmpMin = minutes.toString();

      this.timerInput1 = tmpMin + ':' + tmpSec;
      this.timerInput2 = tmpMin + ':' + tmpSec;
      this.timeRoom = secondAbsolute;
    }, 1000);
  }

  enterMessage(event) {
    if (event.keyCode != 13) return
    if (this.valInput == '') return

    const message = this.chatForm.value.message.replace("\n", " ");

    this.psiquicaservice.sendMessage(
      message,
      'p',
      this.tokenService.GetTokenRoom()).subscribe(response => {
        this.socket.emit("mensaje", { room: this.tokenService.GetTokenRoom() });
        this.chatForm.reset();
      }, err => console.log(err));
  }

  sendMessage() {
    const message = this.chatForm.value.message.replace("\n", " ");

    this.psiquicaservice.sendMessage(
      message,
      'p',
      this.tokenService.GetTokenRoom()).subscribe(response => {
        this.socket.emit("mensaje", { room: this.tokenService.GetTokenRoom() });
        this.chatForm.reset();
      }, err => console.log(err));
  }

  init() {
    this.chatForm = this.fb.group({
      message: ['', Validators.required],
      validator: ['', Validators.required]
    });
  }

  NabMobile() {
    document.addEventListener('DOMContentLoaded', function () {
      let elems = document.querySelectorAll('.sidenav');
      M.Sidenav.init(elems, {});
    });
  }

  CerrarSesion() {
    this.psiquicaservice.closeSession(this.psiquica).subscribe(response => {
      if (response.message) {
        this.tokenService.DeleteTokenPsiquica();
        this.socket.emit('refreshPsiquicas', { message: `${this.psiquicaNombre} salio.` })
        swal(response.message, '', 'info')
          .then(() => window.location.href = "/")
      }
    }, err => console.log(err));
  }

  iniciarAudio() {
    this.audio.src = "../../../assets/audio/chatmusica.mp3";
    this.audio.load();
    this.audio.play();
  }

  terminarAudio() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  validarPsiquica(codigoPsiquica, token) {
    if (codigoPsiquica == this.psiquica['id_psiquica']) {
      const cliente = this.tokenService.GetPayLoadCliente(token);
      this.clienteData = cliente;
      this.clienteToken = token;
      this.mostrarLlamada();
    }
  }

  onlyJosie() {
    if (this.psiquicaNombre == 'JOSIE') {
      this.socket.emit('josie_online', {});
      this.socket.on('usuario_cita', data => {
        this.llamadaCita(data.token, data.cita);
      })
    }
  }

  llamadaCita(tokenUser, cita) {
    this.userService.getProfileByToken(tokenUser).subscribe(response => {
      this.clienteData = response.data;
      this.clienteToken = response.data.token;
      this.citaJosieReg = cita;
      this.mostrarLlamada();
    })
  }

  mostrarLlamada() {
    this.clienteStatus = true;
    let llamadaContent = document.getElementsByClassName('llamadaContainer') as HTMLCollectionOf<HTMLElement>;
    llamadaContent[0].style.display = 'block';
    this.iniciarAudio();
    this.intervalTimer = setTimeout(() => {
      this.cancelarLlamada()
      this.terminarAudio();
    }, 10000);
  }

  hideModal() {
    let llamadaContent = document.getElementsByClassName('llamadaContainer') as HTMLCollectionOf<HTMLElement>;
    llamadaContent[0].style.display = 'none';
    this.terminarAudio();
    clearInterval(this.intervalTimer);
  }

  cancelarLlamada() {
    this.hideModal();
    if (this.psiquicaNombre == 'JOSIE') {
      this.socket.emit('cancelar_llamada_josie', { token: this.clienteData });
    } else {
      this.psiquicaservice.updateStatus(this.psiquica).subscribe(response => {
        if (response.message) {
          this.socket.emit('cancelar_llamada', { token: this.clienteToken, psiquica: response.psiquica });
          this.socket.emit('refreshPsiquicas', { message: `${this.psiquicaNombre} salio.` });
        }
      }, err => console.log(err));
    }

  }

  aceptarLlamada() {
    this.hideModal();

    if (this.psiquicaNombre == 'JOSIE') {
      let body = {
        cliente: this.clienteData,
        psiquica: this.tokenService.GetPayloadPsiquica(),
        cita: this.citaJosieReg
      };
      this.psiquicaservice.makeRoomJosie(body).subscribe(response => {
        if (response.message) {
          this.socket.emit('crear_chat_josie', {
            chatId: response.chatId,
            chatToken: response.chatToken,
            clienteToken: this.clienteToken,
            psiquicaId: this.psiquicaCod
          });
          this.tokenService.setTokenRoom(response.chatToken);
          this.tokenService.SetTokenCliente(this.clienteToken);
          this.socket.emit('entrar_chat_psiquica', { roomToken: response.chatToken });
          this.router.navigateByUrl('/loginpsiquica', { skipLocationChange: true })
            .then(() =>
              this.router.navigate(["lobby"])
            );
        }
      }, err => console.log(err));
    } else {
      let body = {
        cliente: this.clienteData,
        psiquica: this.tokenService.GetPayloadPsiquica()
      };
      this.psiquicaservice.makeRoom(body).subscribe(response => {
        if (response.message) {
          this.socket.emit('crear_chat', {
            chatId: response.chatId,
            chatToken: response.chatToken,
            clienteToken: this.clienteToken,
            psiquicaId: this.psiquicaCod
          });
          this.tokenService.setTokenRoom(response.chatToken);
          this.tokenService.SetTokenCliente(this.clienteToken);
          this.socket.emit('entrar_chat_psiquica', { roomToken: response.chatToken });
          this.router.navigateByUrl('/loginpsiquica', { skipLocationChange: true })
            .then(() =>
              this.router.navigate(["lobby"])
            );
        }
      }, err => console.log(err));
    }
  }

  TerminarChat() {
    swal({
      title: "¿Desea terminar el chat?",
      text: "Si acepta esta conversación se perdera.",
      icon: "warning",
      dangerMode: true,
      buttons: ["Cancelar", true],
    })
      .then(closeChat => {
        if (closeChat) {
          this.psiquicaservice.closeRoom(
            this.tokenService.GetPayloadPsiquica(),
            this.tokenService.GetTokenRoom(),
            0, 'psiquica cerro')
            .subscribe(response => {
              if (response.message)
                this.socket.emit('close_session', { room: this.tokenService.GetTokenRoom() });
            }, err => console.log(err));
        }
      })
  }

  GrabarAudio() {
    this.audioStatus = true;
    this.rec.start();
  }

  TerminarAudio() {
    this.audioStatus = false;
    this.rec.stop();
  }

  askPermissions() {
    navigator.mediaDevices.getUserMedia({
      audio: true
    })
      .then(stream => {
        this.handlerFunction(stream);
      })
  }

  handlerFunction(stream) {
    let parentThis = this;
    this.rec = new MediaRecorder(stream);
    this.rec.ondataavailable = e => {
      this.audioChunks.push(e.data);
      if (this.rec.state == "inactive") {
        let blob = new Blob(this.audioChunks, {
          type: 'audio/ogg'
        })
        this.blobToBase64(blob, function (base64) {
          parentThis.SendAudio(base64);
        });
      }
    }
  }

  SendAudio(base64) {
    const psiquica = this.tokenService.GetPsiquicaRoom();
    const usuario = this.tokenService.GetPayLoadCliente().id_usuario;
    const room = this.tokenService.GetTokenRoom();
    this.psiquicaservice.sendAudio(room, usuario, psiquica, base64).subscribe((response) => {
      this.audioChunks = [];
      this.socket.emit("mensaje", { room: this.tokenService.GetTokenRoom() });
    }, err => console.log(err))
  }

  blobToBase64 = (blob, cb) => {
    let reader = new FileReader();
    reader.onload = function () {
      let dataUrl = reader.result;
      let base64 = (dataUrl as string).split(',')[1];
      cb(base64);
    };
    reader.readAsDataURL(blob);
  };

}
