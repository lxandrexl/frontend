import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import * as M from 'materialize-css';
import { UserService } from '../../services/user.service';
import { FileUploader } from 'ng2-file-upload';
import io from 'socket.io-client';
import { baseURL, imgURL, socketURL } from '../../globalParameters';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfil: any = [];
  perfilImg: string;
  fechaNacFormat: any;
  zodiacoProfile = [];
  perfilDetails: any = [];
  nombreInput: string = ' ';
  apPaternoInput: string = ' ';
  apMaternoInput: string = ' ';
  selectedFile: any;
  extensionFile: any;
  socket: any;

  uploader: FileUploader = new FileUploader({
      url: `${baseURL}/upload-image`,
      disableMultipart: true
  })

  constructor(
    private tokenService: TokenService,
    private userService: UserService
  ) { 
      this.socket = io(socketURL);
   }

  ngOnInit() {
    this.GetProfileData();
    this.InitEffects();
    this.listenSockets();
  }

  GetProfileData() {
    this.userService.getProfileByToken(this.tokenService.GetPayload())
    .subscribe( response => {
        this.perfil = response.data;
        this.nombreInput = this.perfil.nombre;
        this.apPaternoInput = this.perfil.apellido_paterno;
        this.apMaternoInput = this.perfil.apellido_materno;
        this.perfilImg = imgURL + 'profile_img/' + this.perfil.foto; 
        this.DateFormat(this.perfil.fecha_nacimiento);
        this.SetProfileDetails(this.zodiacoProfile[0]);
    }, err => console.log(err) );
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
        rs = 'Aries';
        rangos = '21 Mar. 20 Abr';
    }
    if (day<=20 &&  month==4){
        rs = 'Aries';
        rangos = '21 Mar. 20 Abr';
    }
    if (day>=21 &&  month==4) {
        rs = 'Tauro';
        rangos = '21 Abr. 21 May'; 
    }
    if (day<=21 &&  month==5){
        rs = 'Tauro';
        rangos = '21 Abr. 21 May';
    }
    if (day>=22 &&  month==5){
        rs = 'Géminis';
        rangos = '22 May. 21 Jun';
    }
    if (day<=21 &&  month==6){
        rs = 'Géminis';
        rangos = '22 May. 21 Jun';
    }
    if (day>=22 &&  month==6){
        rs = 'Cáncer';
        rangos = '22 Jun. 22 Jul';
    }
    if (day<=22 &&  month==7){
        rs = 'Cáncer';
        rangos = '22 Jun. 22 Jul';
    }
    if (day>=23 &&  month==7){
        rs = 'Leo';
        rangos = '23 Jul. 23 Ago';
    }
    if (day<=23 &&  month==8){
        rs = 'Leo';
        rangos = '23 Jul. 23 Ago';
    }
    if (day>=24 &&  month==8){
        rs = 'Virgo';
        rangos = '24 Ago. 22 Sep';
    }
    if (day<=22 &&  month==9){
        rs = 'Virgo';
        rangos = '24 Ago. 22 Sep';
    }
    if (day>=23 &&  month==9){
        rs = 'Libra';
        rangos = '23 Sep. 23 Oct';
    }
    if (day<=23 &&  month==10){
        rs = 'Libra';
        rangos = '23 Sep. 23 Oct';
    }
    if (day>=24 &&  month==10){
        rs = 'Escorpio';
        rangos = '24 Oct. 22 Nov';
    }
    if (day<=22 &&  month==11){
        rs = 'Escorpio';
        rangos = '24 Oct. 22 Nov';
    }
    if (day>=23 &&  month==11){
        rs = 'Sagitario';
        rangos = '23 Nov. 21 Dic';
    }
    if (day<=21 &&  month==12){
        rs = 'Sagitario';
        rangos = '23 Nov. 21 Dic';
    }
    if (day>=22 &&  month==12){
        rs = 'Capricornio'; 
        rangos = '22 Dic. 20 Ene';
    }
    if  (day<=20 &&  month==1){
        rs = 'Capricornio';
        rangos = '22 Dic. 20 Ene';
    }
    if (day>=21 &&  month==1){
        rs = 'Acuario';
        rangos = '21 Ene. 18 Feb';
    }
    if (day<=18 &&  month==2){
        rs = 'Acuario';
        rangos = '21 Ene. 18 Feb';
    }
    if (day>=19 &&  month==2){
        rs = 'Piscis';
        rangos = '19 Feb. 20 Mar';
    }
    if (day<=20 &&  month==3){
        rs = 'Piscis';
        rangos = '19 Feb. 20 Mar';
    }
    data[0] = rs;
    data[1] = rangos;
  return data;
  } 

  SetProfileDetails(name) {
      this.userService.getDetailsZodiaco(name)
        .subscribe( response => {
            this.perfilDetails = response.data[0];
        }, err => console.log(err));
  }

  updateProfile() {
    const body = {
        user: this.perfil.id_usuario,
        name: this.nombreInput,
        apPaterno: this.apPaternoInput,
        apMaterno: this.apMaternoInput,
        image: this.selectedFile,
        extension: this.extensionFile
    };

    this.userService.updateProfile(body).subscribe( response => {
        this.socket.emit('refreshPage', this.tokenService.GetToken());
        const filePath = <HTMLInputElement>document.getElementById('filePath');
        filePath.value = '';
        swal(response.message, '', 'success');
    }, err => console.log(err));
  }

  OnFileSelected(event) {
    const file: File = event[0];

    this.ReadAsBase64(file).then( result => {
        this.extensionFile = result.split(';')[0].split('/')[1];
        this.selectedFile = result;
    }).catch(err => console.log(err));
  }

  ReadAsBase64(file): Promise<any> {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
        reader.addEventListener('load',() => {
            resolve(reader.result);
        });

        reader.addEventListener('error', (event) => {
            reject(event);
        });

        reader.readAsDataURL(file);
    })

    return fileValue;
  }

  listenSockets() {
    this.socket.on('refresh', data => {
        if(this.tokenService.GetToken() === data) this.GetProfileData();
    });
  }
}
