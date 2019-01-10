import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { socketURL } from '../../globalParameters';
import io from 'socket.io-client';
import swal from 'sweetalert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginpsiquica',
  templateUrl: './loginpsiquica.component.html',
  styleUrls: ['./loginpsiquica.component.css']
})
export class LoginpsiquicaComponent implements OnInit {
  loginPsiForm: FormGroup;
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
    this.loginPsiForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loginPsiquica() {
    this.authService.loginPsiquica(this.loginPsiForm.value).subscribe( response => {
      if(response.Psiquica) {
        this.tokenService.SetTokenPsiquica(response.token);
        this.socket.emit('refreshPsiquicas', {message: 'Hey, updated...'});
        swal(response.message, "", "success")
          .then(val => {
              this.router.navigate(['/lobby']);
          });
      }
    }, err => {
      if(err.error.message)
      swal(err.error.message, "", "error");
    });
  }

}
