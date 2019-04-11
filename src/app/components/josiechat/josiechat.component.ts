import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PsiquicaService } from '../../services/psiquica.service';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import io from 'socket.io-client';
import { socketURL } from '../../globalParameters';
import * as moment from 'moment';
import swal from 'sweetalert';
import _ from 'lodash';
import { Router } from '@angular/router';


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

  currentTime: any;
  showAdvise: boolean = false;
  buttonMessage = 'Un momento por favor...';
  citaActual: any;

  constructor(
    private router: Router,
    private psiquicaService: PsiquicaService,
    private tokenService: TokenService,
    private userService: UserService
  ) {
    this.socket = io(socketURL);
  }

  ngOnInit() {
    this.loadProfile();
    this.initCalendar(this.onLoadFirstNumber, this.onLoadLastNumber);
    this.listenSockets();
  }

  listenSockets() {
    this.socket.on('reservo_cita', data => {
      this.loadProfile();
    });
    this.socket.on('listen_josie', data => {
      swal({
        title: "Chatea con Josie",
        text: `¡ Ya puedes ingresar al chat !`,
      })
      this.buttonMessage = 'Ingresar al chat';
      this.psiquicaService.getJosieData().subscribe(response => {
        this.josie = response.data;
      }, err => console.log(err));
    });
    this.socket.on('listen_josie_cancel', data => {
      if(data.token.token == this.profile.token) {
        this.closeLlamadaProceso();
        swal({
          text: `Josie no pudo contestar, intentelo nuevamente por favor.`,
          icon: 'error'
        })
      }
    });
    this.socket.on('llamada_aceptada_josie', data => {
      if(this.profile.token != data.clienteToken) return

      this.tokenService.SetPsiquicaRoom(data.psiquicaId);
      this.tokenService.setTokenRoom(data.chatToken);
      this.router.navigate(['/private-room']);
    });
  }

  ingresarChat() {
    if (this.josie.estado == '0') return;
    // clearInterval(this.currentTime);
    // this.showAdvise = false;
    this.showLlamadaProceso();
    this.socket.emit('llamar_josie', {token: this.profile, cita: this.citaActual});
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
    this.router.navigate([`/compras`]);
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

  loadMyCitas() {
    this.userService.getCitasPendientes(this.codigoUsuario).subscribe(response => {
      this.verifyCitas(response.citas);
    });
  }

  configCalendar() {
    let momentTime = parseInt(moment().format('MM').replace(/^0+/, '')) - 1;
    this.calendarTitle = this.meses[momentTime] + ' ' + moment().format('YYYY');
    this.mesCalendario = moment().format('MM');
    this.anioCalendario = moment().format('YYYY');
    this.userService.GetCitasConfiguration().subscribe(response => {
      this.hours = response.horarios;
      this.citas = response.citas;
      this.loadMyCitas();
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
    let findCita = false;
    const cellDate = `${this.dayDataContainer[validator].year}-${this.dayDataContainer[validator].month}-${this.dayDataContainer[validator].day}`;
    const cellHour = hour.horario.trim();
    this.citas.forEach(element => {
      const citaDate = element.fecha.split('T')[0];
      const citaHour = element.hora.trim();
      if (citaDate == cellDate)
        if (citaHour == cellHour)
          findCita = true;
    });
    if (findCita) return false;

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
    if (item > 5 && item < 13) itemDay = itemDay - 7;
    if (item > 13) itemDay = itemDay - 14;
    if (this.detectMobil()) dayOfWeek = this.diasSemanaMovil[itemDay - 1];
    else dayOfWeek = this.diasSemana[itemDay];

    const dayCita = this.dayDataContainer[item];
    if (this.totalCitas > 0) {
      swal({
        title: "Chatea con Josie",
        text: `¿Desea reservar una cita?  
              Día: ${dayOfWeek} ${dayCita.day} de ${this.meses[parseInt(dayCita.month) - 1]}
              Hora de cita: ${hour.horario}`,
        buttons: ["Cancelar", true],
      })
        .then((citaAceptada) => {
          if (citaAceptada) {
            const dateCita = `${dayCita.year}-${dayCita.month}-${dayCita.day}`;
            this.userService.setCita(this.profile.id_usuario, dateCita, hour.horario, this.totalCitas)
              .subscribe(response => {
                swal(`¡${response.message}!`, {
                  icon: "success",
                });
                this.socket.emit('cita_reservada', { token: this.tokenService.GetToken() });
              }, err => {
                console.log(err);
                swal("Ocurrio un error, no se pudo guardar la cita. Intentelo nuevamente", {
                  icon: "error",
                });
              });
          }
        });
    } else {
      swal({
        title: "Chatea con Josie",
        text: 'No cuentas con citas, compra una cita y chatea con Josie',
        buttons: ["No por el momento", true]
      }).then((ok) => {
        if (ok) {
          this.redirectCompras();
        }
      })
    }
  }

  verifyCitas(citas) {
    let citasHoyContent = [];
    let citaHoy = false;
    this.citas.forEach(element => {
      citas.forEach(cita => {
        if (element.id_usuario == cita.id_usuario) {
          let time = element.fecha.split('T');
          if (time[0] == moment().format('YYYY-MM-DD')) {
            swal({
              title: "Chatea con Josie",
              text: `¡ Tiene una cita el día de hoy !`,
            })
            citasHoyContent.push(element);
            citaHoy = true;
          }
        }
      })
    });
    if (citaHoy) {
      if (this.josie.estado == '1') this.buttonMessage = 'Ingrese al chat';

      let citasEncontradas = _.uniqWith(citasHoyContent, _.isEqual);
      this.currentTime = setInterval(() => {
        citasEncontradas.forEach(cita => {
          let findCita = this.timeDiffCita(moment().format('HH:mm'), (cita.hora.split(" - ")[0]));
          if (findCita <= 0 && findCita > -30) {
          // if (findCita <= 0 && findCita > -3) {
            this.showAdvise = true;
            this.citaActual = cita;
          }
        });
      }, 1000);
    }
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

  timeDiffCita(now, cita) {
    var resultado = 0;
    now = now.split(":");
    cita = cita.split(":");
    now = (parseInt(now[0]) * 60) + parseInt(now[1]);
    cita = (parseInt(cita[0]) * 60) + parseInt(cita[1]);
    // cita = 664;
    resultado = cita - now;
    return resultado;
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
    if (this.detectMobil()) this.IntervalStatus = this.IntervalStatus - 2;
    if (this.onLoadFirstNumber >= 14) return false;

    this.onLoadFirstNumber = this.onLoadFirstNumber + 7;
    this.onLoadLastNumber = this.onLoadLastNumber + 7;
    this.initCalendar(this.onLoadFirstNumber, this.onLoadLastNumber);
  }

  prevWeek() {
    this.IntervalStatus = 7;
    if (this.detectMobil()) this.IntervalStatus = this.IntervalStatus - 2;
    if (this.onLoadFirstNumber <= 0) return false;

    this.onLoadFirstNumber = this.onLoadFirstNumber - 7;
    this.onLoadLastNumber = this.onLoadLastNumber - 7;
    this.initCalendar(this.onLoadFirstNumber, this.onLoadLastNumber);
  }

  showLlamadaProceso() {
    let descContainer = document.getElementsByClassName('shadowContainerLlamada') as HTMLCollectionOf<HTMLElement>;
    descContainer[0].style.display = 'block';
  }

  closeLlamadaProceso() {
    let descContainer = document.getElementsByClassName('shadowContainerLlamada') as HTMLCollectionOf<HTMLElement>;
    descContainer[0].style.display = 'none';
  }

  

}
