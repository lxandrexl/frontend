import { Component, OnInit,  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

import swal from 'sweetalert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService
  ) { }


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
    window.location.href= "/signin";
  }

  loginUser() {
    this.authService.loginUser(this.loginForm.value).subscribe( data => {
      this.tokenService.SetToken(data.token);
        this.loginForm.reset();
        swal(data.message, "", "success").then(() => window.location.href="/perfil")
      
    }, err => swal(err.error.message, "", "error"));
  }

}
