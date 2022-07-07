import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface UserData {
  id: string;
  Requested_by: string;
  Datum: string;
  Company: string;
  Company_Code: string;
  Short_text: string;
  PO_Quantity: number;
  Overall_Limit: number;
  GR_Execution_date: string;
  SBU: string,
  Status: string
}

@Component({
  selector: 'table-overview-example',
  styleUrls: ['history.component.css'],
  templateUrl: 'history.component.html',
})

export class HistoryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id',
    'Requested_by',
    'Datum',
    'Company',
    'Company_Code',
    'Short_text',
    'PO_Quantity',
    'Overall_Limit',
    'GR_Execution_date',
    'SBU',
    'Status'];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() { }

  ngOnInit(): void {
    // FETCH FROM DB
    const users = [{
      id: '1',
      Requested_by: 'Een tester',
      Datum: '07/07/2022',
      Company: 'Unliever BV',
      Company_Code: 'be01',
      Short_text: 'Lange tekst test',
      PO_Quantity: 1,
      Overall_Limit: 500,
      GR_Execution_date: 'Juli',
      SBU: 'BE_DEW_4',
      Status: 'Pending'
    },{
      id: '2',
      Requested_by: 'Marcel Tester',
      Datum: '10/07/2022',
      Company: 'NS',
      Company_Code: 'NL01',
      Short_text: 'Affiche testing',
      PO_Quantity: 1,
      Overall_Limit: 722,
      GR_Execution_date: 'Mei',
      SBU: 'BE_HDT_4',
      Status: 'Complete'
    }]

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
    document.body.style.backgroundImage = "url('https://u.cubeupload.com/olsonperrensen2/download.png')"
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
