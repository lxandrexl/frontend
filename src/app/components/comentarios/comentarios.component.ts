import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import * as M from 'materialize-css';
import { PsiquicaService } from 'src/app/services/psiquica.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {
  @Input() psiquica: any;
    comentarios:any = [];

  constructor(private psiquicaService: PsiquicaService) { }

  ngOnInit() {
    this.initCollapse();
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.psiquicaService.getComentarios(this.psiquica.id_psiquica).subscribe((response) => {
      this.comentarios = response.data;
    }, err => console.log(err ));
  }

  initCollapse() {
    let elems = document.querySelectorAll('.collapsible');
    let instances = M.Collapsible.init(elems, {});
  }

}
