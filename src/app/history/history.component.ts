import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GetdataService } from '../getdata.service';

export interface UserData {
  id: string;
  external_id: string;
  requested_by: string;
  datum: string;
  company: string;
  company_code: string;
  short_text: string;
  po_quantity: number;
  overall_limit: number;
  gr_execution_date: string;
  sbu: string,
  status: string
}

@Component({
  selector: 'table-overview-example',
  styleUrls: ['history.component.css'],
  templateUrl: 'history.component.html',
})

export class HistoryComponent implements OnInit{
  longText = `Depending on the status of your PO, it can either be in the "Active" section or in the "Archive" section.\n
  An order which still requires a number confirmation will remain in the "Active" section, whereas any PO which has already been processed and given a number will be
  transfered to the "Archive" section.\n\nPlease make a choice:`;
  ngOnInit(): void {
    document.body.style.backgroundImage = "url('https://u.cubeupload.com/olsonperrensen2/DefaultWallpapermodi.png')"
  }
}
