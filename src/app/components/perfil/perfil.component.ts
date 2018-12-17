import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import * as M from 'materialize-css';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfil = [];
  zodiacoProfile = [];

  constructor(
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.GetProfileData();
    this.InitEffects();
  }

  GetProfileData() {
    this.perfil = this.tokenService.GetPayload();
  }

  DateFormat(date) {
    let fecha = new Date(date);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    this.zodiacoProfile = this.SimboloZodiacal(fecha.getDate(),fecha.getMonth() + 1);
    
    return fecha.toLocaleDateString("es-ES", options);
  }

  InitEffects() {
    document.addEventListener('DOMContentLoaded', function() {
      let elems = document.querySelectorAll('.modal');
      M.Modal.init(elems, {});
    });

    document.addEventListener('DOMContentLoaded', function() {
      let elems = document.querySelectorAll('.tooltipped');
      M.Tooltip.init(elems, {});
    });
  }

  SimboloZodiacal(day, month) {
    let data = [];
    let rs = '';
    let rangos = '';

    if (day>=21 &&  month==3){
        rs = 'ARIES';
        rangos = '21 Mar. 20 Abr';
    }
    if (day<=20 &&  month==4){
        rs = 'ARIES';
        rangos = '21 Mar. 20 Abr';
    }
    if (day>=21 &&  month==4) {
        rs = 'TAURO';
        rangos = '21 Abr. 21 May'; 
    }
    if (day<=21 &&  month==5){
        rs = 'TAURO';
        rangos = '21 Abr. 21 May';
    }
    if (day>=22 &&  month==5){
        rs = 'GEMINIS';
        rangos = '22 May. 21 Jun';
    }
    if (day<=21 &&  month==6){
        rs = 'GEMINIS';
        rangos = '22 May. 21 Jun';
    }
    if (day>=22 &&  month==6){
        rs = 'CANCER';
        rangos = '22 Jun. 22 Jul';
    }
    if (day<=22 &&  month==7){
        rs = 'CANCER';
        rangos = '22 Jun. 22 Jul';
    }
    if (day>=23 &&  month==7){
        rs = 'LEO';
        rangos = '23 Jul. 23 Ago';
    }
    if (day<=23 &&  month==8){
        rs = 'LEO';
        rangos = '23 Jul. 23 Ago';
    }
    if (day>=24 &&  month==8){
        rs = 'VIRGO';
        rangos = '24 Ago. 22 Sep';
    }
    if (day<=22 &&  month==9){
        rs = 'VIRGO';
        rangos = '24 Ago. 22 Sep';
    }
    if (day>=23 &&  month==9){
        rs = 'LIBRA';
        rangos = '23 Sep. 23 Oct';
    }
    if (day<=23 &&  month==10){
        rs = 'LIBRA';
        rangos = '23 Sep. 23 Oct';
    }
    if (day>=24 &&  month==10){
        rs = 'ESCORPIO';
        rangos = '24 Oct. 22 Nov';
    }
    if (day<=22 &&  month==11){
        rs = 'ESCORPIO';
        rangos = '24 Oct. 22 Nov';
    }
    if (day>=23 &&  month==11){
        rs = 'SAGITARIO';
        rangos = '23 Nov. 21 Dic';
    }
    if (day<=21 &&  month==12){
        rs = 'SAGITARIO';
        rangos = '23 Nov. 21 Dic';
    }
    if (day>=22 &&  month==12){
        rs = 'CAPRICORNIO'; 
        rangos = '22 Dic. 20 Ene';
    }
    if  (day<=20 &&  month==1){
        rs = 'CAPRICORNIO';
        rangos = '22 Dic. 20 Ene';
    }
    if (day>=21 &&  month==1){
        rs = 'ACUARIO';
        rangos = '21 Ene. 18 Feb';
    }
    if (day<=18 &&  month==2){
        rs = 'ACUARIO';
        rangos = '21 Ene. 18 Feb';
    }
    if (day>=19 &&  month==2){
        rs = 'PISCIS';
        rangos = '19 Feb. 20 Mar';
    }
    if (day<=20 &&  month==3){
        rs = 'PISCIS';
        rangos = '19 Feb. 20 Mar';
    }
    data[0] = rs;
    data[1] = rangos;
  return data;
  } 

}
