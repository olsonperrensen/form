import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-multi',
  templateUrl: './multi.component.html',
  styleUrl: './multi.component.css',
})
export class MultiComponent {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  toggleDarkMode() {
    alert('coming soon');
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

  openChatbot() {
    alert('coming soon');
  }
}
