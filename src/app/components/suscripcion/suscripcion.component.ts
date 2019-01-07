import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.component.html',
  styleUrls: ['./suscripcion.component.css']
})
export class SuscripcionComponent implements OnInit {
  hosted_button_id: string;
  product_name: string;
  product_price: string;
  product_desc: string;
  profileUser: any = [];
  cod_plan: string;
  type_suscription: string;
  descCulqi = 'Suscripciones Josie D.C.';
  Culqi = window["Culqi"];

  constructor(
    private tokenService: TokenService,
    private userService: UserService
  ) { 
    this.Culqi.publicKey = 'pk_test_TrMHeh2zmzufHMYy';
  }

  ngOnInit() {
    this.initModal();
    this.userService.getProfileByToken(this.tokenService.GetToken())
      .subscribe( response => {
        console.log(response);
    }, err => console.log(err));
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
        this.hosted_button_id = 'Z29JE9BYE99FL';
        this.product_name = 'Plan El Mundo';
        this.product_price = '3999';
        this.cod_plan = 'pln_test_YIeQy8laFn8X8fth';
        this.type_suscription = 'Mundo';
        break;
      case 1:
        this.hosted_button_id = '47LFAXM65GU8S';
        this.product_name = 'Plan El Sol';
        this.product_price = '1999';
        this.cod_plan = 'pln_test_Y8mTIqAqs3k6qeM6';
        this.type_suscription = 'Sol';
        break;
      case 2:
        this.hosted_button_id = 'MKUMEJCMYZSUL';
        this.product_name = 'Plan El Mago';
        this.product_price = '999';
        this.cod_plan = 'pln_test_iegb4CJoe1bzQhgD';
        this.type_suscription = 'Mago';
        break;
    }
  }

  openCulqi() {
    this.Culqi.settings({
      title: this.product_name,
      currency: 'USD',
      description: this.descCulqi,
      amount: this.product_price
    });
    this.Culqi.open();

    this.tokenService.setCookieCulqiType(this.type_suscription);
    this.tokenService.setCookieCulqiPlan(this.cod_plan);
  }

}
