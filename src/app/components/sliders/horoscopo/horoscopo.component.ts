import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-horoscopo',
  templateUrl: './horoscopo.component.html',
  styleUrls: ['./horoscopo.component.css']
})
export class HoroscopoComponent implements OnInit {
  slideIndex = 1;

  constructor(private router: Router) { }

  ngOnInit() {
    this.showSlides(1);
  }

  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  showSlides(n) {
    let i;
    let x = document.getElementsByClassName("slideitem") as HTMLCollectionOf<HTMLElement>;
    if (n > x.length) {this.slideIndex = 1}    
    if (n < 1) {this.slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
    x[this.slideIndex-1].style.display = "block";  
  }

  redirectDetalles(signo) {
    this.router.navigate([`/horoscopo/${signo}`]);
  }
}
