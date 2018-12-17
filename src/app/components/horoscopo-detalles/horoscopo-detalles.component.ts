import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-horoscopo-detalles',
  templateUrl: './horoscopo-detalles.component.html',
  styleUrls: ['./horoscopo-detalles.component.css']
})
export class HoroscopoDetallesComponent implements OnInit {
  signoZodiaco: any;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.signoZodiaco = this.route.snapshot.paramMap.get('signo');
  }

}
