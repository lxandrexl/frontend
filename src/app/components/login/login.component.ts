import { Component, OnInit, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

import swal from 'sweetalert';
import { Router } from '@angular/router';
import { socketURL } from '../../globalParameters';
import io from 'socket.io-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  socket: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.socket = io(socketURL);
  }


  ngOnInit() {
    this.init();
  }

  init() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });
  }

  redirectRegistrar() {
    this.router.navigate(['/signin']);
  }

  loginUser() {
    this.authService.loginUser(this.loginForm.value).subscribe(data => {
      if (data.type == 0) {
        this.tokenService.SetToken(data.token);
        this.loginForm.reset();
        swal(data.message, "", "success").then(() => this.router.navigate(['/perfil']))
      } else if (data.type == 1) {
        this.tokenService.SetTokenPsiquica(data.token);
        this.socket.emit('refreshPsiquicas', { message: 'Hey, updated...' });
        swal(data.message, "", "success").then(() => this.router.navigate(['/lobby']));
      }

    }, err => swal(err.error.message, "", "error"));
  }

}
