import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval } from 'rxjs';


@Component({
  selector: 'app-psiquico',
  templateUrl: './psiquico.component.html',
  styleUrls: ['./psiquico.component.css']
})
export class PsiquicoComponent implements OnInit, OnDestroy  {
  itemPos = 1;
  sub: any;
  constructor() { }

  ngOnInit() {
    this.showSlidesPsi(this.itemPos);
    this.sub = interval(2000).subscribe(res => {
      this.itemPos++;
      this.showSlidesPsi(this.itemPos)
    })
  }

  ngOnDestroy() {
   this.sub.unsubscribe();
  }

  showSlidesPsi(n) {
    let i;
    let x = document.getElementsByClassName("slidePsiItem") as HTMLCollectionOf<HTMLElement>;
    if (n > x.length) {this.itemPos = 1}    
    if (n < 1) {this.itemPos = x.length}
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
    x[this.itemPos-1].style.display = "block";
  }
}
