import { Component, OnInit,  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

import swal from 'sweetalert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;
  constructor(
    private router: Router,
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
    this.router.navigate(['/signin']);
  }

  loginUser() {
    this.authService.loginUser(this.loginForm.value).subscribe( data => {
      this.tokenService.SetToken(data.token);
        this.loginForm.reset();
        swal(data.message, "", "success").then(() => this.router.navigate(['/perfil']))
      
    }, err => swal(err.error.message, "", "error"));
  }

}
