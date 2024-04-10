import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from 'src/app/auth.service';
import { GetdataService } from '../../getdata.service';
import { Location } from '@angular/common';

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
  sbu: string,
  status: string,
  gr: string,
  invoice: string,
  betaald: boolean
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
    'invoice',
    'betaald'];
  // dataSource!: MatTableDataSource<UserData>;

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private getData: GetdataService, private authService: AuthService, private location: Location) { }

  users!: any;
  isArchive = false;
  isChoosing = true;
  u_worker = this.authService.getLocalStorageCredentials()[1]
  ngOnInit(): void {



    // // FETCH FROM DB
    // this.getData.getPO(this.u_worker.toUpperCase()).subscribe((res) => {
    //   this.users = res;
    //   // Assign the data to the data source for the table to render
    //   this.dataSource = new MatTableDataSource(this.users);
    //   this.dataSource.data.forEach((po: any) => {
    //     po.overall_limit = (parseFloat(po.overall_limit) + parseFloat(po.overall_limit_2) + parseFloat(po.overall_limit_3)).toString()
    //   });
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // })
    // document.body.style.backgroundImage = "url('./assets/blur.png')"
  }

  ngAfterViewInit() {

  }

  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  payChange(event: any, row: any) {
    this.getData.editBetaling({ u_ID: row.id, betaald: event.checked }).subscribe((res) => {
      this.checkRes(res);
      res == 200 ? event.source._inputElement.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove() : undefined
    })
  }
  checkRes(res: any) {
    if (res == "500") {
      alert("Could not process the request.");
    }
    else if (res == "200") {
      alert("You have successfully edited the payment status of this PO.");
    }
  }

  goBack(): void {
    this.location.back();
  }
}
