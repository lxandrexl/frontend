import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth.module';
import { AuthRoutingModule } from './modules/auth-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { ComentariosComponent } from './components/comentarios/comentarios.component';

@NgModule({
  declarations: [AppComponent, ComentariosComponent],
  imports: [
    BrowserModule,
    AuthModule,
    AuthRoutingModule,
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
