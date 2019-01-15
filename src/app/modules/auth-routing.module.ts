import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { HoroscopoDetallesComponent } from '../components/horoscopo-detalles/horoscopo-detalles.component';
import { LoginComponent } from '../components/login/login.component';
import { SigninComponent } from '../components/signin/signin.component';
import { AuthGuard } from '../services/auth.guard';
import { PerfilComponent } from '../components/perfil/perfil.component';
import { JosiechatComponent } from '../components/josiechat/josiechat.component';
import { PsiquicachatComponent } from '../components/psiquicachat/psiquicachat.component';
import { ComprasComponent } from '../components/compras/compras.component';
import { SuscripcionComponent } from '../components/suscripcion/suscripcion.component';
import { HistorialComponent } from '../components/historial/historial.component';
import { LoginpsiquicaComponent } from '../components/loginpsiquica/loginpsiquica.component';
import { LobbyComponent } from '../components/lobby/lobby.component';
import { AuthPsiquicaGuard } from '../services/auth-psiquica.guard';
import { LobbyClienteComponent } from '../components/lobby-cliente/lobby-cliente.component';
import { AuthLobbyGuard } from '../services/auth-lobby.guard';
import { PagenotfoundComponent } from '../components/pagenotfound/pagenotfound.component';

const routes:Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  { 
    path: '**', 
    component: PagenotfoundComponent 
  },
  { 
    path: 'horoscopo/:signo', 
    component:  HoroscopoDetallesComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'loginpsiquica',
    component: LoginpsiquicaComponent
  },
  {
    path: 'lobby',
    component: LobbyComponent,
    canActivate: [AuthPsiquicaGuard]
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'chat-josie',
    component: JosiechatComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'chat-psiquica',
    component: PsiquicachatComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'compras',
    component: ComprasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'suscripcion',
    component: SuscripcionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mis-compras',
    component: HistorialComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'private-room',
    component: LobbyClienteComponent,
    canActivate: [AuthLobbyGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], //,{ useHash: true })],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
