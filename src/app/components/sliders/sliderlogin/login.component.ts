import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-sliderlogin',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class SliderLoginComponent implements OnInit {
  itemPos = 1;
  sub: any;
  constructor() { }

  ngOnInit() {
    this.showSlidesPsi(this.itemPos);
    this.sub = interval(3000).subscribe(res => {
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
    if (n > x.length) {this.itemPos = 1}    
    if (n < 1) {this.itemPos = x.length}
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
    x[this.itemPos-1].style.display = "block";
  }
}
