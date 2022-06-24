import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isDutch = true;


  constructor(private translateService:TranslateService) { }

  ngOnInit(): void {
  }

  onLang()
  {
    if(this.isDutch)
    {
      this.isDutch = false
      this.translateService.use('fr-FR')
    }
    else
    {
      this.isDutch = true
      this.translateService.use('nl-NL')
    }
  }

}
