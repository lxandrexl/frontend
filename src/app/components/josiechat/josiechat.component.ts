import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PsiquicaService } from '../../services/psiquica.service';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import io from 'socket.io-client';
import { socketURL } from '../../globalParameters';
import * as moment from 'moment';

@Component({
  selector: 'app-josiechat',
  templateUrl: './josiechat.component.html',
  styleUrls: ['./josiechat.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class JosiechatComponent implements OnInit {
  profile: any = [];
  josie: any;
  socket: any;
  //CALENDAR SETTINGS
  rows: any = '';
  calendarBody: any;
  calendarTitle = '';
  onLoadFirstNumber = 0;
  onLoadLastNumber = 7;
  codigoUsuario: any;
  totalCitas: any;
  date: any = moment().format('YYYY-MM-DD');
  today = moment().format('DD');
  todayNumber = moment().day();
  month = moment().format('MM');
  year = moment().format('YYYY');
  diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  diasSemanaMovil = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  meses: any = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  //CALENDAR VARIABLES
  hours: any;
  citas: any;
  DaysContent: any = [];
  IntervalDate: any = [];

  constructor(
    private psiquicaService: PsiquicaService,
    private tokenService: TokenService,
    private userService: UserService
  ) {
    this.socket = io(socketURL);
  }

  ngOnInit() {
    this.loadProfile();
    this.setIntervalCalendar(this.onLoadFirstNumber, this.onLoadLastNumber, this.detectMobil());
  }

  redirectCompras() {
    window.location.href = 'compras';
  }

  loadProfile() {
    this.userService.getProfileByToken(this.tokenService.GetPayload())
      .subscribe(response => {
        this.profile = response.data;
        this.codigoUsuario = this.profile.id_usuario;
        this.getData();
      })
  }

  getData() {
    this.psiquicaService.getJosieData().subscribe(response => {
      this.josie = response.data;
    }, err => console.log(err));

    this.userService.getCitasUser(this.codigoUsuario).subscribe(response => {
      this.totalCitas = response.data.citas_josie;
      this.configCalendar();
    }, err => console.log(err));
  }

  configCalendar() {
    let momentTime = parseInt(moment().format('MM').replace(/^0+/, '')) - 1;
    this.calendarTitle = this.meses[momentTime] + ' ' + moment().format('YYYY');

    this.userService.GetCitasConfiguration().subscribe(response => {
      this.hours = response.horarios;
      this.citas = response.citas;
    }, err => console.log(err));
  }

  setIntervalCalendar(init, end, type) {
    switch (type) {
      case true:
        init++;
        end--;
        while (init < end) {
          this.IntervalDate.push(init);
          init++;
        }
        break;
      case false:
        while (init < end) {
          this.IntervalDate.push(init);
          init++;
        }
        break;
    }
  }

  setNumerDayCalendar(position) {
    return moment(this.date).weekday(position).format('DD');
  }

  verifyAvaibleDayCalendar(validator, hour) {
    if (this.todayNumber > validator) return false;
    const timeValidator = this.timeDiff(moment().format('HH:mm'), (hour.horario.split(" - ")[0]))
    if (!timeValidator) return false;
    return true;
  }

  openCita(item, hour, event) {
    const validateCell = event.path[0].className;
    if (validateCell == 'nodisponible') return false;

    console.log(item, hour);

  }

  validateCita(hora, fecha, citas) {
    var claseType = 'disponible';
    for (var i = 0; i < citas.length; i++) {
      if (fecha.trim() + ' ' + hora.trim() == citas[i].fecha.trim() + ' ' + citas[i].hora.trim()) {
        claseType = 'citado';
        break;
      }
    }
    return claseType;
  }

  timeDiff(now, cita) {
    var resultado = 0;
    now = now.split(":");
    cita = cita.split(":");
    now = (parseInt(now[0]) * 60) + parseInt(now[1]);
    cita = (parseInt(cita[0]) * 60) + parseInt(cita[1]);
    resultado = cita - now;
    if (resultado < 0) {
      return false;
    }
    return true;
  }

  detectMobil() {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true;
    }
    else {
      return false;
    }
  }
}
