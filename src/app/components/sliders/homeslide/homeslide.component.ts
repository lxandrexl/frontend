import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { TokenService } from 'src/app/services/token.service';
import { imgURL } from '../../../globalParameters';

@Component({
  selector: 'app-homeslide',
  templateUrl: './homeslide.component.html',
  styleUrls: ['./homeslide.component.css']
})
export class HomeslideComponent implements OnInit {
  itemPos = 1;
  sub: any;
  user: any;
  baseurl: string;
  tiempoSlider = 5000;
  constructor(private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit() {
    this.baseurl = imgURL;
    this.user = this.tokenService.GetToken();
    this.showSlidesPsi(this.itemPos);
    this.sub = interval(this.tiempoSlider).subscribe(res => {
      this.itemPos++;
      this.showSlidesPsi(this.itemPos)
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  showSlidesPsi(n) {
    let i;
    let x = document.getElementsByClassName("slideLoginItem") as HTMLCollectionOf<HTMLElement>;
    if (n > x.length) { this.itemPos = 1 }
    if (n < 1) { this.itemPos = x.length }
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    x[this.itemPos - 1].style.display = "block";
  }

  citarJos() {
    if (!this.user)
      this.router.navigate(['/login']);
    //window.location.href="login";
    else
      this.router.navigate(['/chat-josie']);
    //window.location.href="chat-josie";
  }
  imajossie(){
    this.router.navigate(['/chat-josie']);
  }
}
