import {
  AfterViewInit,
  Component,
  Injectable,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth.service';
import { GetdataService } from 'src/app/getdata.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/utils.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(private http: HttpClient) {}

  getInvoice(id: string): Observable<any> {
    // Fetch invoice data based on the provided ID
    return this.http.get(
      `https://as2.ftcdn.net/jpg/02/28/53/67/1024W_F_228536791_oMBqhaWvBcdl4JA4JNtgkqVCS7QT2LPh_NW1.jpg`
    );
  }
}

@Component({
  selector: 'ngbd-modal-invoice-content',
  template: `<div class="modal-header">
      <h4 class="modal-title">Invoice Details</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="activeModal.dismiss('Cross click')"
      ></button>
    </div>
    <div class="modal-body">
      <div class="example-element-diagram">
        <img
          class="d-block mx-auto"
          mat-card-image
          src="assets/invoice-icon.png"
          alt="Photo of a Shiba Inu"
        />
      </div>
      <div class="example-element-description">
        <div>ID: {{ invoice?.id }}</div>
        <div>Requested By: {{ invoice?.requested_by }}</div>
        <div>Date: {{ invoice?.datum }}</div>
        <div>Business: {{ invoice?.company }}</div>
        <div>Country: {{ invoice?.company_code }}</div>
        <div>Text: {{ invoice?.short_text }}</div>
        <div>Total: {{ invoice?.overall_limit }}</div>
        <div>GR: {{ invoice?.gr_execution_date }}</div>
        <div>SBU: {{ invoice?.sbu }}</div>
        <!-- <div>Time since invoice: {{ timeSinceInvoice(invoice?.invoice) }}</div> -->
      </div>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-dark"
        (click)="activeModal.close('Close click')"
      >
        Close
      </button>
    </div>`,
})
export class NgbdModalInvoiceContent {
  invoice: any;
  timeSinceInvoice!: (invoiceDate: string) => string;

  constructor(
    public activeModal: NgbActiveModal,
    public utilsService: UtilsService
  ) {}
}

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
    private _liveAnnouncer: LiveAnnouncer,
    private modalService: NgbModal,
    private invoiceService: InvoiceService,
    public utilsService: UtilsService
  ) {}

  openInvoiceModal(row: UserData) {
    const modalRef = this.modalService.open(NgbdModalInvoiceContent);
    this.invoiceService.getInvoice(row.id).subscribe((invoice) => {
      modalRef.componentInstance.invoice = invoice;
      // modalRef.componentInstance.timeSinceInvoice =
      //   this.utilsService.timeSinceInvoice(row.invoice);
    });
  }
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
