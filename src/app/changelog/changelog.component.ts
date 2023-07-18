import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Commit } from './commit'; // Assuming you have a Commit model or interface

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.css']
})
export class ChangelogComponent implements OnInit {
  commits!: Commit[]; // Array to store the retrieved commits

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // Retrieve the commits from the route data
    this.route.data.subscribe(data => {
      this.commits = data['commits'];
    });
  }
}
