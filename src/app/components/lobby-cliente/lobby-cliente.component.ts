import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import io from 'socket.io-client';
import { socketURL, audioURL } from '../../globalParameters';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-lobby-cliente',
  templateUrl: './lobby-cliente.component.html',
  styleUrls: ['./lobby-cliente.component.css']
})

export class LobbyClienteComponent implements OnInit {
  chatClienteForm: FormGroup;
  roomToken: any;
  socket: any;
  chatContent = [];
  star = 0;
  timeStats: any;
  comentario = '';
  timerRoom: any;
  expireTime = false;
  tmpTokenRoom: any;
  audioStatus = false;
  rec: any;
  audioChunks: any = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tokenService: TokenService,
    public userService: UserService
  ) {
    this.socket = io(socketURL);
  }

  ngOnInit() {
    this.init();
    this.iniciarChat();
    this.listenMessage();
    this.updateTimeRoom();
    this.askPermissions();
  }

  iniciarChat() {
    this.getMessages();
    this.roomToken = this.tokenService.GetTokenRoom();
    if (!this.tokenService.GetTimeRoom()) this.tokenService.SetTimeRoom(0);
    this.socket.emit('entrar_chat_cliente', { roomToken: this.roomToken });
  }

  ProcessTime(event) {

    const time = event.min_psiquica;
    if (!this.tokenService.GetSecondsRoom()) this.tokenService.SetSecondsRoom(0);

    if (this.tokenService.GetPsiquicaRoom() == '3') { // ID DE JOSIE
      if (!this.tokenService.GetMinutesRoom()) this.tokenService.SetMinutesRoom('30');
    } else {
      if (!this.tokenService.GetMinutesRoom()) this.tokenService.SetMinutesRoom(time);
    }
  }

  hideContainer() {
    const container = document.querySelector('.closeChatContainer');
    (container as HTMLElement).style.display = 'none';
    this.star = 0;
    this.comentario = '';
    this.socket.emit('continue_timer_navbar', { room: this.tokenService.GetTokenRoom() });
    this.updateTimeRoom();
  }

  init() {
    this.chatClienteForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  getMessages() {
    this.userService.getMessages(this.tokenService.GetTokenRoom())
      .subscribe(response => {
        this.chatContent = response.data;
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

  receiverChatData(event) {
    this.timeStats = event;

    if (this.timeStats.end) {
      this.showCommentContainer();
    }
  }

  showCommentContainer() {
    const container = document.querySelector('.closeChatContainer');
    (container as HTMLElement).style.display = 'block';
    clearInterval(this.timerRoom);
  }

  updateTimeRoom() {
    this.timerRoom = setInterval(() => {
      const Cliente = this.tokenService.GetPayload();
      if (this.tokenService.GetPsiquicaRoom() != '3') {
        this.userService.UpdateRoom(Cliente, this.tokenService.GetTokenRoom(), this.timeStats, false)
          .subscribe(response => {
          }, err => console.log(err));
      }
    }, 10000);
  }

  enterMessage(event) {
    if (event.keyCode != 13) return
    const message = this.chatClienteForm.value.message.replace("\n", " ");

    this.userService.sendMessage(
      message,
      'c',
      this.tokenService.GetTokenRoom()).subscribe(response => {
        this.socket.emit("mensaje", { room: this.tokenService.GetTokenRoom() });
        this.chatClienteForm.reset();
      }, err => console.log(err));
  }

  sendMessage() {
    const message = this.chatClienteForm.value.message.replace("\n", " ");

    this.userService.sendMessage(
      message,
      'c',
      this.tokenService.GetTokenRoom()).subscribe(response => {
        this.socket.emit("mensaje", { room: this.tokenService.GetTokenRoom() });
        this.chatClienteForm.reset();
      }, err => console.log(err));
  }

  listenMessage() {
    this.socket.on('recibir_mensaje', data => {
      // UPDATE MENSAJES
      this.getMessages();
    })

    this.socket.on('end_chat', data => {
      clearInterval(this.timerRoom);
      this.closeCita();
      swal('La psiquica cerro el chat', '', 'info')
        .then(() => {
          this.tokenService.DeleteTokenRoom();
          this.tokenService.DeleteTimeRoom();
          this.tokenService.DeleteMinutesroom();
          this.tokenService.DeleteSecondsRoom();
          this.tokenService.DeletePsiquicaRoom();
          //this.router.navigate(['/']);
          window.location.href = '/';
        })
    })

    this.socket.on('end_chat_system', data => {
      swal('Su tiempo a terminado.', 'Para continuar chateando compre uno de nuestros paquetes.', 'info')
        .then(val => {
          this.expireTime = true;
          this.ExpireChat();
          let closeBtn = document.querySelector('.closeStarsContainer');
          (closeBtn as HTMLElement).style.display = 'none';
          this.showCommentContainer();
        });
    })
  }

  ExpireChat() {
    this.closeCita();
    this.userService.expireRoom(this.tokenService.GetTokenRoom())
      .subscribe(response => {
        if (response.message) {
          this.tokenService.DeleteTokenRoom();
          this.tokenService.DeleteTimeRoom();
          this.tokenService.DeleteMinutesroom();
          this.tokenService.DeleteSecondsRoom();
          this.tokenService.DeletePsiquicaRoom();
        }
      }, err => console.log(err));
  }

  TerminarChat() {
    if (!this.expireTime) {
      this.userService.closeRoom(
        this.tokenService.GetPsiquicaRoom(),
        this.timeStats.timeTotal,
        this.roomToken,
        this.star,
        this.comentario
      ).subscribe(response => {
        if (response.message) {
          this.socket.emit('close_session', { room: this.tokenService.GetTokenRoom() });
        }
      }, err => console.log(err));
    } else {
      this.userService.closeRoom(
        this.tokenService.GetPsiquicaRoom(),
        'expire_action',
        this.roomToken,
        this.star,
        this.comentario
      ).subscribe(response => {
        if (response.message) {
          this.router.navigate(['/compras']);
        }
      }, err => console.log(err));
    }
    this.closeCita();
  }

  closeCita() {
    if (this.tokenService.GetPsiquicaRoom() == '3') {
      this.userService.closeCita(this.roomToken).subscribe(response => {
        console.log(response);
      }, err => console.log(err));
    }
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
    const usuario = this.tokenService.GetPayload().id_usuario;
    const room = this.tokenService.GetTokenRoom();
    this.userService.sendAudio(room, usuario, psiquica, base64).subscribe((response) => {
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
