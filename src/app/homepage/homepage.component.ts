import { Component, OnInit } from '@angular/core';
import * as a from 'angular-animations'
import { AuthService } from '../auth.service';
import { GetdataService } from '../getdata.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  animations: [
    a.fadeInLeftBigOnEnterAnimation()
  ]
})
export class HomepageComponent implements OnInit {


  constructor(private getData: GetdataService, private authService: AuthService) { }

  ngOnInit(): void {
    document.body.style.backgroundImage = "url('https://i.postimg.cc/8NqcDrfY/Default-Wallpaper.png')";
  }

}
