import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { PsiquicaService } from '../../services/psiquica.service';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import _ from 'lodash';

@Component({
  selector: 'app-historychat',
  templateUrl: './historychat.component.html',
  styleUrls: ['./historychat.component.css']
})
export class HistorychatComponent implements OnInit {
  profile: any = [];
  chats: any = [];
  chatForm: any;
  totalMinutos = 0;
  totalSegundos = 0;
  showTotal = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private psiquicaService: PsiquicaService
  ) { }

  ngOnInit() {
    this.init();
    this.loadProfile();
  }

  init() {
    this.chatForm = this.fb.group({
      fecha: ['', [Validators.required]]
    });
  }

  loadProfile() {
    this.profile = this.tokenService.GetPayloadPsiquica();
  }

  Regresar() {
    this.router.navigate(['lobby']);
  }

  GetChats() {
    this.chats = [];
    this.totalMinutos = 0;
    this.totalSegundos = 0;
    this.psiquicaService.getChats(this.profile.id_psiquica, this.chatForm.value.fecha)
      .subscribe((response) => {
        this.chats = response.data;
        this.TotalTime(this.chats);
      }, err => console.log(err));
  }

  FormatDate(time) {
    return moment(time).format('DD-MM-YYYY HH:mm:ss');
  }

  GetMinutes(time) {
      return Math.trunc(time / 60);
  }

  GetSeconds(time) {
    return (time % 60);
  }

  TotalTime(data) {
    _.forEach(data, (val, key) => {
      this.totalMinutos = this.totalMinutos + Math.trunc(val.tiempo / 60);      
      this.totalSegundos = this.totalSegundos + (val.tiempo % 60);
    });
    this.showTotal = true;
  }

}
