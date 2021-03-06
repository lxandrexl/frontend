import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as M from 'materialize-css';
import swal from 'sweetalert';

import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signupForm: FormGroup;
  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.init();
    this.activeSelectInput();
  }

  init() {
    this.signupForm = this.fb.group({
      nombres: ['', Validators.required],
      apPaterno: ['', Validators.required],
      apMaterno: ['', Validators.required],
      sexo: ['', Validators.required],
      fechaNac: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      direccion: ['', Validators.required],
      pais: ['', Validators.required]
    });
  }

  activeSelectInput() {
    document.addEventListener('DOMContentLoaded', function() {
      let elems = document.querySelectorAll('select');
      M.FormSelect.init(elems, {});
    });
  }

  redirectLogin() {
    this.router.navigate(['/login']);
  }

  signupUser() {
    this.authService.registerUser(this.signupForm.value).subscribe( data => {
      this.tokenService.SetToken(data.token);
        this.signupForm.reset();
        swal(data.message, "", "success").then(() => this.router.navigate(['/perfil']))

    }, err =>   swal(err.error.msg[0].message, "", "error"));
  }

}
