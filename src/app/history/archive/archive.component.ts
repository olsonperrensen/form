import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from 'src/app/auth.service';
import { Location } from '@angular/common';
import { GetdataService } from '../../getdata.service';

export interface UserData {
  id: string;
  requested_by: string;
  datum: string;
  company: string;
  company_code: string;
  short_text: string;
  po_quantity: number;
  overall_limit: string;
  overall_limit_2: string;
  overall_limit_3: string;
  gr_execution_date: string;
  sbu: string;
  status: string;
  gr: string;
  invoice: string;
  betaald: boolean;
}

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css'],
})
export class ArchiveComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
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
    'invoice',
    'betaald',
  ];
  // dataSource!: MatTableDataSource<UserData>;

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private getData: GetdataService,
    private authService: AuthService,
    private location: Location
  ) {}

  users!: any;
  isArchive = false;
  isChoosing = true;
  u_worker!: any;

  ngOnInit(): void {
    this.u_worker = this.authService.getLocalStorageCredentials()[1];

    // FETCH FROM DB
    this.getData.getArchivePO(this.u_worker.toUpperCase()).subscribe((res) => {
      this.users = res;
      // Assign the data to the data source for the table to render
      // this.dataSource = new MatTableDataSource(this.users);
      // this.dataSource.data.forEach((po: any) => {
      //     po.overall_limit = (parseFloat(po.overall_limit) + parseFloat(po.overall_limit_2) + parseFloat(po.overall_limit_3)).toString()
      // });
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    });
    document.body.style.backgroundImage = "url('./assets/blur.png')";
  }

  ngAfterViewInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //     this.dataSource.paginator.firstPage();
    // }
  }
  goBack(): void {
    this.location.back();
  }
}
