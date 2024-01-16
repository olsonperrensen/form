import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth.service';
import { GetdataService } from '../../getdata.service';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';

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
  selector: 'app-filterpo',
  templateUrl: './filterpo.component.html',
  styleUrls: ['./filterpo.component.css'],
 providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ]
})
export class FilterpoComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });


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
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private getData: GetdataService, private authService: AuthService, private _formBuilder: FormBuilder) { }

  users!: any;
  isArchive = false;
  isChoosing = true;
  u_worker = this.authService.getLocalStorageCredentials()[1]
  filteringComplete = false;

  ngOnInit(): void {
    document.body.style.backgroundImage = "url('./assets/blur.png')"
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

  f() {
    let voorkeur_jaar = this.firstFormGroup.get('firstCtrl')?.value;
    let biz = this.secondFormGroup.get('secondCtrl')?.value;
    this.filteringComplete = true;
    // FETCH FROM DB
    this.getData.getFilterPO(this.u_worker.toUpperCase(), voorkeur_jaar, biz).subscribe((res) => {
      this.users = res;
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.data.forEach(po => {
        po.overall_limit = (parseFloat(po.overall_limit) + parseFloat(po.overall_limit_2) + parseFloat(po.overall_limit_3)).toString()
      });
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  anotherSearch() {
    this.stepper.reset();
    this.filteringComplete = false;
  }
}
