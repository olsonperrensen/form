import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { GetdataService } from '../getdata.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  userName!: any;

  constructor(
    private getData: GetdataService,
    private authService: AuthService,
    private location: Location
  ) {
    const credentials = this.authService.getCredentials();
    const nameArray = credentials?.naam?.toLowerCase().split(' ');
    this.userName =
      nameArray?.[0]?.charAt(0).toUpperCase() + nameArray?.[0]?.slice(1);
  }

  ngOnInit(): void {
    document.body.style.backgroundImage =
      "url('https://i.postimg.cc/8NqcDrfY/Default-Wallpaper.png')";
  }
  logOut(): void {
    var cookies = document.cookie.split(';');

    // Loop through each cookie and delete it
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf('=');
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    //this.location.back();
    // Clear local storage
    localStorage.clear();

    // Clear session storage
    sessionStorage.clear();

    // Reload the page
    location.reload();
  }
}
