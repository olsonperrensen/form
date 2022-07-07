import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface UserData {
  id: string;
  Requested_by: string;
  Timestamp: string;
  Company: string;
  Company_Code: string;
  Short_text: string;
  PO_Quantity: number;
  Overall_Limit: number;
  GR_Execution_date: string;
  Order: string,
  Status: string
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'table-overview-example',
  styleUrls: ['history.component.css'],
  templateUrl: 'history.component.html',
})
export class HistoryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id',
    'Requested_by',
    'Timestamp',
    'Company',
    'Company_Code',
    'Short_text',
    'PO_Quantity',
    'Overall_Limit',
    'GR_Execution_date',
    'Order',
    'Status'];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() { }

  ngOnInit(): void {
    // Create 100 users
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

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

function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: '',
    Requested_by: '',
    Timestamp: '',
    Company: '',
    Company_Code: '',
    Short_text: '',
    PO_Quantity: 1,
    Overall_Limit: 1,
    GR_Execution_date: '',
    Order: '',
    Status: ''
  };
}
