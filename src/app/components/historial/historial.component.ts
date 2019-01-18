import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { TokenService } from 'src/app/services/token.service';
import * as moment from 'moment';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  payload: any = [];
  compras = [];

  constructor(private userService: UserService, private tokenService: TokenService) { }

  ngOnInit() {
    this.payload = this.tokenService.GetPayload();
    this.userService.getHistorialCompras(this.payload.email).subscribe((response) => {
      this.compras = response.data;
    },err => console.log(err))    
  }

  FormatDate( time ) {
    return moment(time).format('DD-MM-YYYY');
  }

}
