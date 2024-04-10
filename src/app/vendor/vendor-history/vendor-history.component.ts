import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { GetdataService } from '../../getdata.service';
import { Location } from '@angular/common';
export interface UserData {
  id: string;
  external_id: string;
  requested_by: string;
  klant: string;
  adres: string;
  email: string;
  gsm: string;
  vat: number;
  contact: number;
  klantnr: string;
  file: string;
  status: string;
}

@Component({
  selector: 'app-vendor-history',
  templateUrl: './vendor-history.component.html',
  styleUrls: ['./vendor-history.component.css']
})
export class VendorHistoryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id',
    'requested_by',
    'klant',
    'adres',
    'email',
    'gsm',
    'vat',
    'contact',
    'klantnr',
    'file',
    'status'];
  // dataSource!: MatTableDataSource<UserData>;

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;

  // constructor(private getData: GetdataService, private location: Location) { }

  // users!: any;
  // isArchive = false;
  // isChoosing = true;

  ngOnInit(): void {



    // FETCH FROM DB
    // this.getData.getVendor().subscribe((res) => {
    //   this.users = res;
    //   // Assign the data to the data source for the table to render
    //   this.dataSource = new MatTableDataSource(this.users);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // })
    document.body.style.backgroundImage = "url('https://u.cubeupload.com/olsonperrensen2/skyscraperwallpaperu.jpg')"
  }

  ngAfterViewInit() {

  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
  // goBack(): void {
  //   this.location.back();
  // }
}
