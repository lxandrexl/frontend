import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import io from 'socket.io-client';
import { socketURL } from '../../globalParameters';
import { UserService } from '../../services/user.service';

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
  star: any;
  timeStats = [];

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private userService: UserService
  ) { 
      this.socket = io(socketURL);
  }

  ngOnInit() {
    this.init();
    this.iniciarChat();
    this.listenMessage();
  }

  iniciarChat() {
    this.getMessages();
    this.roomToken = this.tokenService.GetTokenRoom();
    this.socket.emit('entrar_chat_cliente', { roomToken: this.roomToken });
  }

  init() {
    this.chatClienteForm = this.fb.group({
      message: ['', Validators.required]
    });
  }
  
  getMessages() {
    this.userService.getMessages(this.tokenService.GetTokenRoom())
    .subscribe( response => {
      this.chatContent = response.data;
    }, err => console.log(err));    
  }

  receiverChatData(event) {
    this.timeStats = event;
    const container = document.querySelector('.closeChatContainer');
    (container as HTMLElement).style.display = 'block';
  }
  
  enterMessage(event) {
    if( event.keyCode != 13) return 
    const message = this.chatClienteForm.value.message.replace("\n"," ");
    
    this.userService.sendMessage(
      message, 
      'c', 
      this.tokenService.GetTokenRoom()).subscribe( response => {
        this.socket.emit("mensaje", { room: this.tokenService.GetTokenRoom() });
        this.chatClienteForm.reset();
      }, err => console.log(err));
  }

  sendMessage() {
    const message = this.chatClienteForm.value.message.replace("\n"," ");

    this.userService.sendMessage(
      message, 
      'c', 
      this.tokenService.GetTokenRoom()).subscribe( response => {
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
      this.tokenService.DeleteTokenRoom();
      window.location.href='';
    })
  }

  TerminarChat() {
    console.log(this.timeStats);
    
    console.log(this.star);
    
  }


}
