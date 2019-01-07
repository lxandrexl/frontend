import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  modalInstance: any;
  userData: any = [];
  ppHosted: String;
  nombreUser: String;
  apPaternoUser: String;
  apMaternoUser: String;
  emailUser: String;
  producto1: String;
  producto2: String;
  titleCulqi: String;
  precioCulqi: String;
  descCulqi = 'Compra de Paquetes Josie D.C.';
  Culqi = window["Culqi"];

  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {
    this.Culqi.publicKey = 'pk_test_TrMHeh2zmzufHMYy';
  }

  ngOnInit() {
    this.getProfile();
    this.initModal();
  }

  getProfile() {
    this.userService.getProfileByToken(this.tokenService.GetPayload())
      .subscribe(response => {
        this.userData = response.data;
        this.nombreUser = this.userData.nombre;
        this.apPaternoUser = this.userData.apellido_paterno;
        this.apMaternoUser = this.userData.apellido_materno;
        this.emailUser = this.userData.email;
      })
  }

  initModal() {
    document.addEventListener('DOMContentLoaded', function () {
      let elems = document.querySelectorAll('.modal');
      this.modalInstance = M.Modal.init(elems, {});
    });
  }

  setProducto(type) {
    switch (type) {
      case 0:
        this.ppHosted = 'G4PUQ4CQS3VCC';
        this.producto1 = '30 minutos';
        this.producto2 = 'JOSIE';
        this.titleCulqi = 'Pq.30min Josie';
        this.precioCulqi = '8000';
        break;
      case 1:
        this.ppHosted = 'GYT3AW4CBNLBQ';
        this.producto1 = '20 minutos';
        this.producto2 = '20 minutos';
        this.titleCulqi = 'Pq.20min';
        this.precioCulqi = '900';
        break;
      case 2:
        this.ppHosted = 'GYT3AW4CBNLBQ';
        this.producto1 = '30 minutos';
        this.producto2 = '30 minutos';
        this.titleCulqi = 'Pq.30min';
        this.precioCulqi = '1300';
        break;
      case 3:
        this.ppHosted = 'GYT3AW4CBNLBQ';
        this.producto1 = '50 minutos';
        this.producto2 = '50 minutos';
        this.titleCulqi = 'Pq.50min';
        this.precioCulqi = '1900';
        break;
    }
  }

  openCulqi() {
    this.Culqi.settings({
      title: this.titleCulqi,
      currency: 'USD',
      description: this.descCulqi,
      amount: this.precioCulqi
    });
    this.Culqi.open();

    this.tokenService.setCookieCulqiDesc(this.descCulqi);
    this.tokenService.setCookieCulqiPrice(this.precioCulqi);
    this.tokenService.setCookieCulqiProduct(this.titleCulqi);
    this.tokenService.setCookieCulqiEmail(this.emailUser);
    this.tokenService.setCookieCulqiType('Cargo');
  }
}
