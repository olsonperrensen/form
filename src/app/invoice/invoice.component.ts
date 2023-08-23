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
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const CCEMAILS = new Map<string, any>();


@Component({
  selector: 'ngbd-modal-content',
  template: `<a>todo</a>
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
  styleUrls: ['./invoice.component.scss'],
  animations:
    [a.fadeInLeftOnEnterAnimation(),
    a.bounceOutOnLeaveAnimation(),
    a.bounceOnEnterAnimation()]
})

export class InvoiceComponent implements OnInit {
  open(url: any) {
    const modalRef = this.modalService.open(NgbdModalContent, { fullscreen: true });
    modalRef.componentInstance.sbu2 = url;
    modalRef.componentInstance.sbu3 = 2;
    return modalRef.result
  }
  sent = false
  exit = false
  fakemodal = false
  fakemodalFailure = false;
  imageSafeUrl!: SafeUrl;
  allPO: PO[] = [];
  selectedPO !: PO;
  postatus = ''
  poStatusFinal = false;
  wantsOne = false;
  wantsAll = false;
  isFormValidWithFile = false;
  manueelNr!: any;


  selected_files: File[] = [];
  pdfDoc!: PDFDocument;

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
  fd = new FormData();

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

  onUsrReset() {
    this.fakemodal = false;
    this.fakemodalFailure = false;
    this.sent = false;
    // Clear attachments
    this.onFileRemoved('internal_trigger', 0)
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
    this.selected_files = this.selected_files.splice(i, -1);
  }

  onOpnieuwFactuur() {
    console.log("TODO")
  }

  async onSubmitDrag(u_ID: any) {
    // Wipe before retrying

    this.fd = new FormData();

    this.isBezig = true;
    this.sent = true;
    this.fakemodal = false;
    this.fakemodalFailure = false;
    this.exit = false;

    this.ref = this.selectedPO.id;
    this.fd.append('u_ID', u_ID);
    this.fd.append('u_ref', this.ref);
    this.fd.append('file', this.selected_files[0], this.selected_files[0].name);


    try {
      // PO AANWEZIGHEIDSCONTROLE (PDF) [FASTAPI]
      const formData: FormData = new FormData();
      formData.append('file', this.selected_files[0], this.selected_files[0].name);
      // FIRST PART - figure out factuurnr + datum
      this.getData.getMeta(formData).subscribe((res: any) => {
        this.exit = true;
        if (res.nr === "manually control in .PDF") {
          this.manueelNr = prompt("Please enter factuur nummer:")
          res.nr = this.manueelNr;
        }
        console.log(res)
        this.fd.append('u_fnr', res.nr);
        this.fd.append('u_fdatum', res.datum);
        // SECOND PART - figure out PO
        this.getData.getOCR(formData).subscribe((res: any) => {
          this.exit = true;
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result !== null) { // Null check
              const base64data = reader.result.toString();
              this.imageUrl = base64data;
              this.imageSafeUrl = this.sanitizer.bypassSecurityTrustUrl(this.imageUrl);
              this.fakemodal = true;
              // Detect if OCR fails
              if (res.size < 200) {
                this.fakemodalFailure = true;
                return
                // Code below gets ignored 
              }
              // Continue w/legacy code (reaches index.js EXPRESS.JS NODE)
              this.sendVendors.sendInvoice(this.fd).subscribe((res) => {
                this.res = <Res>res;
                console.log(res)
                if (this.res.response === "250 Message received") {
                  alert(`Invoice naar AP gestuurd! This invoice has been scanned and it passed our tests. It looks legitimate and contains a PO (detected here in green). Thank you for using SBDForms. No further action is required. You may now leave this page.`)
                  this.selected_files = [];
                  this.u_ID = '';
                  this.postatus = 'Net bijgewerkt / Modifications effectuées'
                  this.poStatusFinal = true;
                }
                else {
                  alert("Er ging iets mis.")
                }
                this.isBezig = false;
              });
            }
          };
          reader.readAsDataURL(res);
        })
      });
      this.isBezig = false;
    } catch (err) {
      console.error(err);
      alert("Er ging iets mis.");
      this.isBezig = false;
    }
  }
  getRandomPosition(max: number, initialPos: number) {
    const minDifference = -70; // Minimum difference in position
    const maxDifference = 70; // Maximum difference in position

    let newPosition;
    if (Math.random() < 0.5) { // Randomly choose whether to increase or decrease
      newPosition = initialPos + Math.floor(Math.random() * (maxDifference - minDifference + 1)) + minDifference;
    } else {
      newPosition = initialPos - Math.floor(Math.random() * (maxDifference - minDifference + 1)) + minDifference;
    }

    return Math.max(0, Math.min(newPosition, max)); // Ensure the new position is within bounds
  }
  async onPlakken(u_ID: any) {
    this.isBezig = true;
    this.sent = true;
    this.fakemodal = false;
    this.fakemodalFailure = false;
    this.exit = false;
    const pdfBytesIN = await this.selected_files[0].arrayBuffer();
    this.pdfDoc = await PDFDocument.load(pdfBytesIN);
    const helveticaFont = await this.pdfDoc.embedFont(StandardFonts.Helvetica)
    const pages = this.pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()
    const voorlopigw = this.getRandomPosition(width, width / 2 + width / 22);
    const voorlopigh = this.getRandomPosition(height, height / 2 + height / 24);
    firstPage.drawText(`PO ${this.u_ID}`, {
      x: voorlopigw,
      y: voorlopigh,
      size: 33,
      font: helveticaFont,
      color: rgb(0.95, 0.1, 0.1)
    });


    const pdfBytesOUT = await this.pdfDoc.save()
    const pdfBlob = new Blob([pdfBytesOUT], { type: 'application/pdf' });
    const blobURL = URL.createObjectURL(pdfBlob);

    // Create a new anchor element
    const anchor = document.createElement('a');
    anchor.href = blobURL;
    anchor.download = this.selected_files[0].name;

    // Append the anchor element to the document body
    document.body.appendChild(anchor);

    // Simulate a click on the anchor element
    anchor.click();

    // Remove the anchor element from the document body
    document.body.removeChild(anchor);
    // Almost idem to onSubmitDrag but now with edited bestand! 
    // Wipe before retrying

    this.fd = new FormData();

    this.ref = this.selectedPO.id;
    this.fd.append('u_ID', u_ID);
    this.fd.append('u_ref', this.ref);
    this.fd.append('file', pdfBlob, this.selected_files[0].name);


    try {
      // PO AANWEZIGHEIDSCONTROLE (PDF) [FASTAPI]
      const formData: FormData = new FormData();
      formData.append('file', pdfBlob, this.selected_files[0].name);
      this.getData.getOCR(formData).subscribe((res: any) => {
        this.exit = true;
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result !== null) { // Null check
            const base64data = reader.result.toString();
            this.imageUrl = base64data;
            this.imageSafeUrl = this.sanitizer.bypassSecurityTrustUrl(this.imageUrl);
            this.fakemodal = true;
            // Detect if OCR fails
            if (res.size < 200) {
              this.fakemodalFailure = true;
              return
              // Code below gets ignored 
            }
            // Continue w/legacy code (reaches index.js EXPRESS.JS NODE)

            this.sendVendors.sendInvoice(this.fd).subscribe((res) => {
              this.res = <Res>res;
              console.log(res)
              if (this.res.response === "250 Message received") {
                alert(`Invoice naar AP gestuurd! This invoice has been scanned and it passed our tests. It looks legitimate and contains a PO (detected here in green). Thank you for using SBDForms. No further action is required. You may now leave this page.`)
                this.selected_files = [];
                this.u_ID = '';
                this.postatus = 'Net bijgewerkt / Modifications effectuées';
                this.poStatusFinal = true;
              }
              else {
                alert("Er ging iets mis.")
              }
              this.isBezig = false;
            });
          }
        };
        reader.readAsDataURL(res);
      })
      this.isBezig = false;
    } catch (err) {
      console.error(err);
      alert("Er ging iets mis.");
      this.isBezig = false;
    }
  }

  onSubmitDragMultiple(selectedIDs: any) {
    this.fd = new FormData();
    this.fd.append('u_IDs', selectedIDs);
    this.selected_files.forEach((file, index) => {
      this.fd.append(`file[${index}]`, file, file.name);
    });
    this.isBezig = true;
    // TODO
    alert("UNDER MAINTAINANCE! Come back later...")
  }
}
