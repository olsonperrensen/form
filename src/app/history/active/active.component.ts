import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth.service';
import { GetdataService } from 'src/app/getdata.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'app-active',
  styleUrls: ['./active.component.css'],
  templateUrl: './active.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ActiveComponent implements OnInit, AfterViewInit {
  dummy() {
    alert('Coming soon. Nothing changed.');
  }
  dataSource!: MatTableDataSource<UserData>;
  users: any;
  u_worker: any;
  columnsToDisplay = [
    'id',
    'requested_by',
    'datum',
    'company',
    'overall_limit',
    'status',
    'betaald',
  ];
  constructor(
    private getData: GetdataService,
    private authService: AuthService,
    private location: Location,
    private _liveAnnouncer: LiveAnnouncer
  ) {}
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {}
  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  ngOnInit(): void {
    // FETCH FROM DB
    this.u_worker = this.authService.getLocalStorageCredentials()[1];
    this.getData.getPO(this.u_worker.toUpperCase()).subscribe((res) => {
      this.users = res;
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource<UserData>(this.users);
      this.dataSource.data.forEach((po) => {
        po.overall_limit = (
          parseFloat(po.overall_limit) +
          parseFloat(po.overall_limit_2) +
          parseFloat(po.overall_limit_3)
        ).toString();
      });
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    document.body.style.backgroundImage = "url('./assets/blur.png')";
  }
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: UserData | null;
  goBack(): void {
    this.location.back();
  }
  timeSinceInvoice(invoiceDate: string): string {
    const invoiceDateTime = new Date(invoiceDate);
    const currentDateTime = new Date();
    const timeDiff = currentDateTime.getTime() - invoiceDateTime.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    return `${days} days, ${hours} hrs, ${minutes} mins, ${seconds} secs`;
  }

  notifyOverduePayment() {
    alert('Coming soon. Nothing changed.');
  }
}

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
