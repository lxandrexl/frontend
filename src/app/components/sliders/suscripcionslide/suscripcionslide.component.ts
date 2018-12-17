import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-suscripcionslide',
  templateUrl: './suscripcionslide.component.html',
  styleUrls: ['./suscripcionslide.component.css']
})
export class SuscripcionslideComponent implements OnInit,OnDestroy {
  itemPos = 1;
  sub: any;
  constructor() { }

  ngOnInit() {
    this.showSlidesSuscripcion(this.itemPos);
    this.sub = interval(3000).subscribe(res => {
      this.itemPos++;
      this.showSlidesSuscripcion(this.itemPos)
    })
  }

  ngOnDestroy() {
   this.sub.unsubscribe();
  }

  showSlidesSuscripcion(n) {
    let i;
    let x = document.getElementsByClassName("slideSuscripcionItem") as HTMLCollectionOf<HTMLElement>;
    if (n > x.length) {this.itemPos = 1}    
    if (n < 1) {this.itemPos = x.length}
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
    x[this.itemPos-1].style.display = "block";
  }
}
