import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HomeComponent } from '../components/home/home.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { HoroscopoComponent } from '../components/sliders/horoscopo/horoscopo.component';
import { PsiquicoComponent } from '../components/sliders/psiquico/psiquico.component';
import { HoroscopoDetallesComponent } from '../components/horoscopo-detalles/horoscopo-detalles.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { SigninComponent } from '../components/signin/signin.component';
import { SliderLoginComponent } from '../components/sliders/sliderlogin/login.component';
import { PerfilComponent } from '../components/perfil/perfil.component';
import { JosiechatComponent } from '../components/josiechat/josiechat.component';
import { PsiquicachatComponent } from '../components/psiquicachat/psiquicachat.component';
import { ComprasComponent } from '../components/compras/compras.component';
import { SuscripcionComponent } from '../components/suscripcion/suscripcion.component';
import { HistorialComponent } from '../components/historial/historial.component';
import { SuscripcionslideComponent } from '../components/sliders/suscripcionslide/suscripcionslide.component';
import { LoginpsiquicaComponent } from '../components/loginpsiquica/loginpsiquica.component';
import { LobbyComponent } from '../components/lobby/lobby.component';
import { LobbyClienteComponent } from '../components/lobby-cliente/lobby-cliente.component';
import { PsiquicaService } from '../services/psiquica.service';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { FileUploadModule } from 'ng2-file-upload';
import {NgxAutoScrollModule} from "ngx-auto-scroll";
//ALTERNATIVE SOLUTION FOR URLS NAVIGATION
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


@NgModule({
  imports: [
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    CommonModule, 
    RouterModule, 
    HttpClientModule, 
    FormsModule, 
    ReactiveFormsModule,
    FileUploadModule,
    NgxAutoScrollModule
  ],
  declarations: [
    HomeComponent, 
    NavbarComponent, 
    FooterComponent,
    HoroscopoComponent,
    PsiquicoComponent,
    HoroscopoDetallesComponent, 
    LoginComponent, 
    SigninComponent,
    SliderLoginComponent,
    PerfilComponent, 
    JosiechatComponent, 
    PsiquicachatComponent, 
    ComprasComponent, 
    SuscripcionComponent, 
    HistorialComponent,
    SuscripcionslideComponent,
    LoginpsiquicaComponent,
    LobbyComponent,
    LobbyClienteComponent
    ],
  exports: [],
  providers: [
    PsiquicaService, 
    AuthService, 
    TokenService, 
    UserService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ]
})
export class AuthModule { }
