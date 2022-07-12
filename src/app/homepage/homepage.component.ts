import { Component, OnInit } from '@angular/core';
import * as a from 'angular-animations'
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


  constructor(private getData:GetdataService) { }

  ngOnInit(): void {
    document.body.style.backgroundImage = "url('https://i.postimg.cc/8NqcDrfY/Default-Wallpaper.png')"
    this.getData.getServerStatus().subscribe(
      (res:any) => {
        console.log(`Home res:`)
        console.log(res)
        if (res.myMsg === "Hello world!") { console.log(res.myMsg);this.getData.setServerStatus(false)}
        else { console.log("Server didn't gave helloworld.");this.getData.setServerStatus(true) }
      }, (err) => {
        console.log(`Home err: ${err.body}`)
        this.getData.setServerStatus(true)
      }
    )
     
  }

}
