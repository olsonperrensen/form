import { Component, OnInit } from '@angular/core';
import { GetdataService } from '../getdata.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  logArray : any[] = []

  constructor(private getData: GetdataService) { }

  ngOnInit(): void {
    this.getData.getLog().subscribe((res: any) => {
      res.forEach((element: any) => {
        this.logArray.push(element.split("\t"))
      });
    }, (err) => {
      alert("Backend is down")
    });
  }

}
