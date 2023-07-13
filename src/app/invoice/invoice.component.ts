import { Component, Input, NgModule, OnInit } from '@angular/core';
import { FormControl, NgForm, NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GetdataService } from '../getdata.service';
import { SendFormsService } from '../send-forms.service';
import * as a from 'angular-animations'
import { Router } from '@angular/router';
import { SendVendorsService } from '../send-vendors.service';
import { Res } from './../vendor/res';
import { AuthService } from '../auth.service';
import { PO } from './PO';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

const CCEMAILS = new Map<string, any>();


@Component({
  selector: 'ngbd-modal-content',
  template: `
		<div class="modal-header">
			<h4 class="modal-title">One last step</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
    <div class="modal-init">
		<div class="modal-body">
			<p>Would you like to include the other Sales Representatives in CC?</p>
      <img [src]="sbu2" alt="">
		</div>
		<div class="modal-footer">
    <button type="button" class="btn btn-primary" (click)="ccInput()">Yes</button>
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">No</button>
		</div>
    </div>
    <div style='display:none;' class="modal-cc">
		<div class="modal-body">
    <div class="input-group mb-3 cc1group">
  <input type="text" 
  class="form-control cc-1" 
  placeholder="{{sbu2}} Salesman (name.surname)" 
  id="cc1"
  (change)="store($event)"
  aria-label="Recipient's username" aria-describedby="basic-addon2">
  <span class="input-group-text" id="basic-addon2">@sbdinc.com</span>
</div>
<div class="input-group mb-3 cc2group">
  <input type="text" 
  class="form-control cc-2" 
  placeholder="{{sbu3}} Salesman (name.surname)" 
  id='cc2'
  (change)="store($event)"
  aria-label="Recipient's username" aria-describedby="basic-addon2">
  <span class="input-group-text" id="basic-addon2">@sbdinc.com</span>
</div>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-dark" (click)="activeModal.close('Close click')">Save</button>
		</div>
    </div>
	`,
})

export class NgbdModalContent implements OnInit {
  @Input() sbu2: any;
  @Input() sbu3: any;
  wantsCC = false;
  ccInput() {
    const element = <HTMLElement>document.getElementsByClassName('modal-init')[0];
    const elementcc = <HTMLElement>document.getElementsByClassName('modal-cc')[0];
    element.style.display = 'none';
    elementcc.style.display = 'block';
    if (this.sbu3.length < 1) {
      const cc2group = <HTMLElement>document.getElementsByClassName('cc2group')[0];
      cc2group.style.display = 'none';
    }
  }
  store(event: any) {
    const DOMAIN = '@sbdinc.com'
    if (event.target.value.includes(' ')) {
      event.target.value = event.target.value.replace(/\s+/g, '.')
    }
    if (event.target.id == 'cc1') {
      CCEMAILS.set('cc1', event.target.value.split("@")[0] + DOMAIN)
    }
    else {
      CCEMAILS.set('cc2', event.target.value.split("@")[0] + DOMAIN)
    }
  }
  constructor(public activeModal: NgbActiveModal) { }
  ngOnInit(): void {
  }
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  animations:
    [a.fadeInLeftOnEnterAnimation(),
    a.bounceOutOnLeaveAnimation(),
    a.bounceOnEnterAnimation()]
})

export class InvoiceComponent implements OnInit {
  open(url: any) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.sbu2 = url;
    modalRef.componentInstance.sbu3 = 2;
    return modalRef.result
  }
  allPO: PO[] = [];
  selectedPO !: PO;
  postatus = ''
  wantsOne = false;
  wantsAll = false;
  isFormValidWithFile = false;
  selected_files: File[] = [];
  myControl3 = new FormControl();
  myControl3_multiple = new FormControl();
  filteredOptions3!: Observable<string[]>;
  options3 !: string[]
  res !: Res;
  u_ID = '';
  selectedIDs!: any;
  ref = '';
  isBackendDown = false;
  isID = false;
  isBezig = false;

  u_worker = this.authService.getLocalStorageCredentials()[1]
  found = false;
  logArray: any[] = []
  imageUrl!: string;

  constructor(private http: HttpClient, private getData: GetdataService,
    private sendForms: SendFormsService,
    private router: Router, private sendVendors: SendVendorsService,
    private authService: AuthService, private sanitizer: DomSanitizer, private modalService: NgbModal) { }

  ngOnInit(): void {
    // CALL MOTHERSHIP FASTAPI
    this.getData.getFastLog().subscribe((res: any) => {
      if (res.status == 200) {
        this.logArray = res
        console.log(this.logArray)
      }
    }, (err) => {
      alert(`At this moment the PO scanner tool is offline. You can still use all other parts of the site,
      however checking whether a PO nr has been attached to your invoice will not be possible. 
      Please come back in a few minutes.`)
    });

    this.options3 = [];
    this.getData.getPO(this.u_worker.toUpperCase()).subscribe((res: any) => {
      res.forEach((element: any) => {
        this.allPO.push(element);
        this.options3.push(element.status)
      });
    })
    this.filteredOptions3 = this.myControl3.valueChanges.pipe(
      startWith(''),
      map(value => this._filter3(value)),
    );
    this.myControl3.valueChanges.subscribe((res) => {
      // Exact match full ID 
      if (this.options3.find((obj) => { return obj === res; })) {
        if (this.allPO.find((po) => {
          if (po.status == res) {
            po.overall_limit = !this.found ? (parseFloat(po.overall_limit) + parseFloat(po.overall_limit_2) + parseFloat(po.overall_limit_3)).toString() : po.overall_limit
            this.found = true;
            this.selectedPO = po;
            this.postatus = this.selectedPO.invoice !== 'Pending' ? 'Al gestuurd/Déjà envoyé' : 'Nog niet behandeld/Pas encore traité'
          }
          return po === res;
        })) {

        }
        this.isID = true;
      }
      else {
        this.isID = false;
        this.selected_files = [];
      }
    });
    this.myControl3_multiple.valueChanges.subscribe((res) => {
      res.length > 0 ? this.isID = true : this.isID = false;
    })
  }

  onUserWantsOne() {
    this.wantsOne = true;
  }
  onUserWantsAll() {
    this.wantsAll = true;
  }

  private _filter3(value: string): string[] {
    const filterValue = value;
    return this.options3.filter(option => option.toString().includes(filterValue));
  }
  onFileSelected(event: any) {
    this.isFormValidWithFile = true;
    this.selected_files.push(...event.addedFiles);
  }
  onFileRemoved(event: any, i: number) {
    this.selected_files.splice(i, 1);
  }
  async onSubmitDrag(u_ID: any) {
    const fd = new FormData();
    this.ref = this.selectedPO.id;
    fd.append('u_ID', u_ID);
    fd.append('u_ref', this.ref);
    fd.append('file', this.selected_files[0], this.selected_files[0].name);
    this.isBezig = true;

    try {
      // PO AANWEZIGHEIDSCONTROLE (PDF) [FASTAPI]
      const formData: FormData = new FormData();
      formData.append('file', this.selected_files[0], this.selected_files[0].name);
      this.getData.getOCR(formData).subscribe((res: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result !== null) { // Null check
            const base64data = reader.result.toString();
            this.imageUrl = 'data:image/jpeg;base64,' + base64data;
            console.log(this.imageUrl)
            this.open(this.imageUrl);
          }
        };
        reader.readAsDataURL(res);
      })
      // const res = await this.sendVendors.sendInvoice(fd).toPromise();
      // this.res = <Res>res;

      // if (this.res.response === "250 Message received") {
      //   alert("Invoice naar AP gestuurd!");
      //   this.selected_files = [];
      //   this.u_ID = '';
      //   this.postatus = 'Net bijgewerkt / Modifications effectuées';
      // } else {
      //   alert("Er ging iets mis.");
      // }

      this.isBezig = false;
    } catch (err) {
      console.error(err);
      alert("Er ging iets mis.");
      this.isBezig = false;
    }
  }

  onSubmitDragMultiple(selectedIDs: any) {
    const fd = new FormData();
    fd.append('u_IDs', selectedIDs);
    this.selected_files.forEach((file, index) => {
      fd.append(`file[${index}]`, file, file.name);
    });
    this.isBezig = true;
    // TODO
    alert("UNDER MAINTAINANCE! Come back later...")
  }
}
