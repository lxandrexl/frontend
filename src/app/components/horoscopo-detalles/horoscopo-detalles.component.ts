import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-horoscopo-detalles',
  templateUrl: './horoscopo-detalles.component.html',
  styleUrls: ['./horoscopo-detalles.component.css']
})
export class HoroscopoDetallesComponent implements OnInit {
  signoZodiaco: any = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.GetSigno();
  }

  GetSigno() {
    const signo = this.route.snapshot.paramMap.get('signo');
    this.userService.getDetailsZodiaco(signo).subscribe( response => {
      this.signoZodiaco = response.data[0];
    }, err => window.location.href='/');
  }

}
