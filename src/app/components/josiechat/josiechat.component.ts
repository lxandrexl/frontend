import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PsiquicaService } from '../../services/psiquica.service';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import io from 'socket.io-client';
import { socketURL } from '../../globalParameters';
import * as moment from 'moment';
import swal from 'sweetalert';

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
  calendarTitle = '';
  onLoadFirstNumber = 0;
  onLoadLastNumber = 7;
  codigoUsuario: any;
  totalCitas: any;
  //CALENDAR VARIABLES
  date: any = moment().format('YYYY-MM-DD');
  today = moment().format('DD');
  todayNumber = moment().day();
  diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  diasSemanaMovil = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  meses: any = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  hours: any;
  citas: any;
  mesCalendario: any;
  anioCalendario: any;
  IntervalDate: any = [];
  IntervalStatus: number = 7;
  IntervalIndex: number = 0;
  dayDataContainer = [];

  constructor(
    private psiquicaService: PsiquicaService,
    private tokenService: TokenService,
    private userService: UserService
  ) {
    this.socket = io(socketURL);
  }

  ngOnInit() {
    this.loadProfile();
    this.initCalendar(this.onLoadFirstNumber, this.onLoadLastNumber);
  }

  initCalendar(start, end) {
    this.tokenService.setCalendarPrevToken(start);
    this.tokenService.setCalendarNextToken(end);
    this.setIntervalCalendar(
      parseInt(this.tokenService.getCalendarPrevToken()),
      parseInt(this.tokenService.getCalendarNextToken()),
      this.detectMobil()
    );
  }

  redirectCompras() {
    window.location.href = 'compras';
  }

  loadProfile() {
    if (this.detectMobil()) this.IntervalStatus = this.IntervalStatus - 2;

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
    this.mesCalendario = moment().format('MM');
    this.anioCalendario = moment().format('YYYY');
    this.userService.GetCitasConfiguration().subscribe(response => {
      this.hours = response.horarios;
      this.citas = response.citas;
    }, err => console.log(err));
  }

  setIntervalCalendar(init, end, type) {
    this.IntervalDate = [];
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

  setNumberDayCalendar(position) {
    this.IntervalStatus--;
    if (this.IntervalStatus >= 0) {
      this.dayDataContainer[position] = {
        day: moment(this.date).weekday(position).format('DD'),
        month: moment(this.date).weekday(position).format('MM'),
        year: moment(this.date).weekday(position).format('YYYY')
      }
    }
    return moment(this.date).weekday(position).format('DD');
  }

  verifyAvaibleDayCalendar(validator, hour) {
    if (validator == 0 || validator == 6 || validator == 7 || validator == 13 ||
      validator == 14 || validator >= 20) return false;
    if (this.todayNumber > validator) return false;

    const timeValidator = this.timeDiff(moment().format('HH:mm'), (hour.horario.split(" - ")[0]));
    const dayToday = moment(this.date).weekday(validator).format('DD');

    if (!timeValidator && dayToday == this.today) return false;
    return true;
  }
  //PROCESO PARA RESERVAR CITA
  openCita(item, hour, event) {
    const validateCell = event.path[0].className;
    if (validateCell == 'nodisponible') return false;
    let itemDay = item;
    let dayOfWeek = '';
    if(item > 5 && item < 13) itemDay = itemDay - 7;
    if(item > 13) itemDay = itemDay - 14;
    if (this.detectMobil()) dayOfWeek = this.diasSemanaMovil[itemDay - 1];
    else dayOfWeek = this.diasSemana[itemDay];
    
    swal({
      title: "Chatea con Josie",
      text: `¿Desea reservar una cita?  
            Día: ${dayOfWeek} ${this.dayDataContainer[item].day} de ${this.meses[parseInt(this.dayDataContainer[item].month) - 1]}
            Hora de cita: ${hour.horario}`,            
      buttons: ["Cancelar", true],
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("Poof! Your imaginary file has been deleted!", {
          icon: "success",
        });
      } 
    });
    console.log(this.dayDataContainer[item], hour.horario, dayOfWeek);
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

  nextWeek() {
    this.IntervalStatus = 7;
    if(this.detectMobil()) this.IntervalStatus = this.IntervalStatus -2;
    if (this.onLoadFirstNumber >= 14) return false;

    this.onLoadFirstNumber = this.onLoadFirstNumber + 7;
    this.onLoadLastNumber = this.onLoadLastNumber + 7;
    this.initCalendar(this.onLoadFirstNumber, this.onLoadLastNumber);
  }

  prevWeek() {
    this.IntervalStatus = 7;
    if(this.detectMobil()) this.IntervalStatus = this.IntervalStatus -2;
    if (this.onLoadFirstNumber <= 0) return false;

    this.onLoadFirstNumber = this.onLoadFirstNumber - 7;
    this.onLoadLastNumber = this.onLoadLastNumber - 7;
    this.initCalendar(this.onLoadFirstNumber, this.onLoadLastNumber);
  }

}
