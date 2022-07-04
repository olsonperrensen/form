import { Component, OnInit } from '@angular/core';
import * as a from 'angular-animations'

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  animations: [
    a.fadeInLeftBigOnEnterAnimation()
  ]
})
export class HomepageComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
  }

}
