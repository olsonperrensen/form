import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth.service';
import { GetdataService } from '../../getdata.service';

export interface UserData {
  id: string;
  requested_by: string;
  datum: string;
  company: string;
  company_code: string;
  short_text: string;
  po_quantity: number;
  overall_limit: number;
  gr_execution_date: string;
  sbu: string,
  status: string,
  gr: string,
  invoice: string,
}


@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.css']
})
export class ActiveComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id',
    'requested_by',
    'datum',
    'company',
    'company_code',
    'short_text',
    'po_quantity',
    'overall_limit',
    'gr_execution_date',
    'sbu',
    'status',
    'gr',
    'invoice'];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private getData: GetdataService, private authService: AuthService) { }

  users!: any;
  isArchive = false;
  isChoosing = true;
  u_worker = this.authService.getCredentials().naam
  ngOnInit(): void {



    // FETCH FROM DB
    this.getData.getPO(this.u_worker).subscribe((res) => {
      this.users = res;
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    document.body.style.backgroundImage = "url('https://i3.lensdump.com/i/t5EhpH.png')"
  }

  ngAfterViewInit() {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
