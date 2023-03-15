import { Component, Input, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as a from 'angular-animations';
import dateFormat from "dateformat";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { GetdataService } from '../getdata.service';
import { IpServiceService } from '../ip-service.service';
import { SendFormsService } from '../send-forms.service';

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
      CCEMAILS.set('cc1', event.target.value + DOMAIN)
    }
    else {
      CCEMAILS.set('cc2', event.target.value + DOMAIN)
    }
  }

  constructor(public activeModal: NgbActiveModal) { }
  ngOnInit(): void {
  }
}


@Component({
  selector: 'app-autocomplete-filter-example',
  templateUrl: './autocomplete-filter-example.component.html',
  styleUrls: ['./autocomplete-filter-example.component.scss'],
  animations: [
    a.fadeInLeftOnEnterAnimation(),
    a.fadeInOnEnterAnimation(),
    a.fadeInRightOnEnterAnimation(),
    a.bounceOnEnterAnimation(),
    a.bounceOutOnLeaveAnimation()
  ]
})
export class AutocompleteFilterExampleComponent implements OnInit {

  open() {
    if (!this.split) {
      const myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("foo");
        }, 1);
      });
      return myPromise
    }
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.sbu2 = this.u_merk_2;
    modalRef.componentInstance.sbu3 = this.u_merk_3;
    return modalRef.result
  }

  modalHasClosed = false;
  sent = false;
  exit = false;


  isPro = false;
  isConsumer = false;

  isWorker = false;
  isVerkoper = false;

  isLand = false;
  isKlant = false;
  isBedrag = false;
  isBedrag_2 = false;
  isOmschrijving = false;
  invalidOmschrijving = false;

  isNewVendor = false;
  isOutdatedVendor = false;

  isBackendDown = false;

  split = false;
  split2 = false;
  split3 = false;

  myControl = new FormControl();
  myControl2 = new FormControl();
  myControl3 = new FormControl();
  myControl3_2 = new FormControl();
  myControl3_3 = new FormControl();
  myControl4 = new FormControl();
  myControl5 = new FormControl();
  myControl6 = new FormControl();
  myControl8 = new FormControl();
  myControl9 = new FormControl();
  myControl9_2 = new FormControl();
  myControl9_3 = new FormControl();
  myControl10 = new FormControl();
  myControlsplitn = new FormControl();

  options2!: string[];
  options3: string[] = ["DeWALT – LENOX – BOSTITCH", "STANLEY", "FACOM"];
  options3_2: string[] = ["DeWALT – LENOX – BOSTITCH", "STANLEY", "FACOM"];
  options3_3: string[] = ["DeWALT – LENOX – BOSTITCH", "STANLEY", "FACOM"];
  options4: string[] = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  options5: string[] = ["België / Belgique", "Nederland / Pays Bas"];
  optionssplitn: string[] = ["2", "3"];

  deWALT_employees = [
    // DeWALT
    "Patrick Diepenbach",
    "Jean-Francois Forton",
    "Marcel VandenBerge",
    "Jeroen VanBerkel",
    "Cindy Eekels",
    "Bob Vandenberghen",
    "Nicolas Dedobbeleer",
    "Bram Hennebert",
    "Steve Oris",
    "Christian Darmont",
    "Frank Mentens",
    "Etienne Delvosalle",
    "Jeroen Decherf",
    "Carlos DeBruijn",
    "Michiel Vliek",
    "Wouter Rook",
    "Arnold Wever",
    "Oscar Laureijs", "Kevin Markestein", "David Goubert", "Gunther Mergan", "Jurgen DeLeeuw",
    "Thomas Molendijk", "Marcelino Papperse", "Andor DeVries", "Ivo Schouten", "Eric Nieuwmans", "Ludwig Vanhaute"];
  facom_employees = [
    "Piet Verstraete", "Vincent Broertjes", "Jean-Christophe Pintiaux", "Kim Maris", "Mario Reverse",
    "Peter Schaekers", "Robin Roels", "Stefan Sack", "Vincent Lenain", "Vincent Pireyn", "Yves DeWaal",
    "Adriaan Arkeraats", "Arno DeJager", "Duncan DeWith"];
  stanley_employees = ["Ken Leysen", "Martin Van Werkhoven", "Paul Kerkhoven", "Cedric Bicque",
    "Christian Fonteyn", "KlaasJan Bosgraaf", "Ammaar Basnoe", "Robert VanStraten", "Sven Pieters",
    "Niek Nijland"];

  filteredOptions!: Observable<string[]>;
  filteredOptions2!: Observable<string[]>;
  filteredOptions3!: Observable<string[]>;
  filteredOptions3_2!: Observable<string[]>;
  filteredOptions3_3!: Observable<string[]>;
  filteredOptions4!: Observable<string[]>;
  filteredOptions5!: Observable<string[]>;
  filteredOptionsSplitN!: Observable<string[]>;

  ipAddress = '';

  constructor(private sendForms: SendFormsService, private ip: IpServiceService,
    private getData: GetdataService, private router: Router,
    private authService: AuthService, private modalService: NgbModal) { }

  ngOnInit() {
    this.getData.getClients().subscribe((res: any) => {
      this.options2 = res.sort();
      this.isBackendDown = false;
      console.log(`BackEnd is up! ${this.options2.length} All good!`);
      if (this.options2.length < 1000) {
        console.log(`Backend down: this.options2.length ${this.options2.length}`)
        this.isBackendDown = true;
      }
    }, (err) => {
      this.isBackendDown = true;
    });
    document.body.style.backgroundImage = "url('https://i.postimg.cc/8NqcDrfY/Default-Wallpaper.png')"
    this.getIP();
    this.isBackendDown = this.getData.getBackendBoolean()
    setTimeout(() => {
      this.filteredOptions2 = this.myControl2.valueChanges.pipe(
        startWith(''),
        map(value => this._filter2(value)),
      );
      this.filteredOptions3 = this.myControl3.valueChanges.pipe(
        startWith(''),
        map(value => this._filter3(value)),
      );
      this.filteredOptions3_2 = this.myControl3_2.valueChanges.pipe(
        startWith(''),
        map(value => this._filter3_2(value)),
      );
      this.filteredOptions3_3 = this.myControl3_3.valueChanges.pipe(
        startWith(''),
        map(value => this._filter3_3(value)),
      );
      this.filteredOptions4 = this.myControl4.valueChanges.pipe(
        startWith(''),
        map(value => this._filter4(value)),
      );
      this.filteredOptions5 = this.myControl5.valueChanges.pipe(
        startWith(''),
        map(value => this._filter5(value)),
      );
      this.filteredOptionsSplitN = this.myControlsplitn.valueChanges.pipe(
        startWith(''),
        map(value => this._filtersplitn(value)),
      );
    }, 800);


    // Own Observables
    // Pro
    this.myControl6.valueChanges.subscribe((res) => {
      if (this.deWALT_employees.find((obj) => { return obj.toLowerCase() === res.toLowerCase(); })) {
        document.body.style.backgroundImage = "url('https://bynder.sbdinc.com/m/6fc93a774163540b/Drupal_Medium-DW_Elite_G1.jpg')";
        this.u_merk = this.options3[0];
        this.isWorker = true;
      }
      else if (this.stanley_employees.find((obj) => { return obj.toLowerCase() === res.toLowerCase(); })) {
        document.body.style.backgroundImage = "url('https://bynder.sbdinc.com/m/2f45051af153cd5d/Drupal_Large-ST_Workshop_G2.jpg')";
        this.u_merk = this.options3[1];
        this.isWorker = true;
      }
      else if (this.facom_employees.find((obj) => { return obj.toLowerCase() === res.toLowerCase(); })) {
        document.body.style.backgroundImage = "url('https://photo.facom.com/facom/images/login-background.jpg')";
        this.u_merk = this.options3[2];
        this.isWorker = true;
      }
      else {
        this.u_merk = "";
        this.isWorker = false;
      }
      setTimeout(() => {
        switch (this.u_worker) {
          case "Gunther Mergan":
            this.u_land = "België / Belgique"
            break;
          case "Jean-Francois Forton":
            this.u_land = "België / Belgique"
            break;
          case "Marcel VandenBerge":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Jeroen VanBerkel":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Cindy Eekels":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Bob Vandenberghen":
            this.u_land = "België / Belgique"
            break;
          case "Nicolas Dedobbeleer":
            this.u_land = "België / Belgique"
            break;
          case "Bram Hennebert":
            this.u_land = "België / Belgique"
            break;
          case "Steve Oris":
            this.u_land = "België / Belgique"
            break;
          case "Christian Darmont":
            this.u_land = "België / Belgique"
            break;
          case "Frank Mentens":
            this.u_land = "België / Belgique"
            break;
          case "Etienne Delvosalle":
            this.u_land = "België / Belgique"
            break;
          case "Jeroen Decherf":
            this.u_land = "België / Belgique"
            break;
          case "Carlos DeBruijn":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Michiel Vliek":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Wouter Rook":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Arnold Wever":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Oscar Laureijs":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Kevin Markestein":
            this.u_land = "België / Belgique"
            break;
          case "David Goubert":
            this.u_land = "België / Belgique"
            break;
          case "Jurgen DeLeeuw":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Thomas Molendijk":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Marcelino Papperse":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Andor DeVries":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Ivo Schouten":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Patrick Diepenbach":
            this.u_land = "België / Belgique"
            break;
          case "Piet Verstraete":
            this.u_land = "België / Belgique"
            break;
          case "Vincent Broertjes":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Jean-Christophe Pintiaux":
            this.u_land = "België / Belgique"
            break;
          case "Kim Maris":
            this.u_land = "België / Belgique"
            break;
          case "Mario Reverse":
            this.u_land = "België / Belgique"
            break;
          case "Peter Schaekers":
            this.u_land = "België / Belgique"
            break;
          case "Robin Roels":
            this.u_land = "België / Belgique"
            break;
          case "Stefan Sack":
            this.u_land = "België / Belgique"
            break;
          case "Vincent Lenain":
            this.u_land = "België / Belgique"
            break;
          case "Vincent Pireyn":
            this.u_land = "België / Belgique"
            break;
          case "Yves DeWaal":
            this.u_land = "België / Belgique"
            break;
          case "Adriaan Arkeraats":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Arno DeJager":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Duncan DeWith":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Ken Leysen":
            this.u_land = "België / Belgique"
            break;
          case "Paul Kerkhoven":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Cedric Bicque":
            this.u_land = "België / Belgique"
            break;
          case "Christian Fonteyn":
            this.u_land = "België / Belgique"
            break;
          case "KlaasJan Bosgraaf":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Ammaar Basnoe":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Robert VanStraten":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Sven Pieters":
            this.u_land = "België / Belgique"
            break;
          case "Niek Nijland":
            this.u_land = "Nederland / Pays Bas"
            break;
          case "Ludwig Vanhaute":
            this.u_land = "België / Belgique"
            break;
          default:
            break;
        }
        this.isLand = true;
      }, 26);
    });

    this.myControl3.valueChanges.subscribe((res) => {
      switch (res.toLowerCase()) {
        case this.options3[0].toLowerCase():
          this.isVerkoper = true;
          // code block
          break;
        case this.options3[1].toLowerCase():
          this.isVerkoper = true;
          // code block
          break;
        case this.options3[2].toLowerCase():
          this.isVerkoper = true;
          // code block
          break;
        case this.options3[3].toLowerCase():
          this.isVerkoper = true;
          // code block
          break;
        default:
          this.isVerkoper = false;
        // code block
      }
    });

    setTimeout(() => {
      this.myControl2.valueChanges.subscribe((res) => {
        // Exact match full klant 
        if (this.options2.find((obj) => { return obj.toLowerCase() === res.toLowerCase(); })
          && this.isLand) {
          this.isKlant = true;
        }
        else {
          this.isKlant = false;
        }
      });
    }, 800);
    this.myControl9.valueChanges.subscribe((res) => {
      if (res >= 50 && res <= 89000 && this.isKlant) {
        this.isBedrag = true;
      }
      else {
        this.isBedrag = false;
      }
    });
    this.myControl9_2.valueChanges.subscribe((res) => {
      if (res >= 50 && res <= 89000 && this.isKlant) {
        this.isBedrag_2 = true;
      }
      else {
        this.isBedrag_2 = false;
      }
    });

    this.myControl10.valueChanges.subscribe((res) => {
      if (res.length > 4 && res.length <= 40 && this.isBedrag) {
        this.isOmschrijving = true;
      }
      else {
        if (res.length < 4 && res.length > 40) this.invalidOmschrijving = true;
        this.isOmschrijving = false;
      }
    })
  }

  potype() {
    if (this.u_potype === "Pro") {
      this.isPro = true;
      this.isConsumer = false;
    }
    else if (this.u_potype === "Consumer") {
      this.isConsumer = true;
      this.isPro = false;
    }
  }
  klant() {
    setTimeout(() => {
      if (this.u_klantnaam.includes("B/") || this.u_klantnaam.toUpperCase().includes('INACTIVE')) {
        this.isOutdatedVendor = true;
      }
      else {
        this.isOutdatedVendor = false;
      }
      if (!this.options2.includes(this.u_klantnaam) && this.u_klantnaam.length > 3) {
        this.isNewVendor = true;
      }
      else {
        this.isNewVendor = false;
      }
    }, 800);
  }

  landtype() {
    if (this.isVerkoper) {
      this.isLand = true;
    }
  }

  split_n() {
    if (this.u_split_n == 2) {
      this.split2 = !this.split2;
      this.split3 = false;
    }
    else if (this.u_split_n == 3) {
      this.split3 = !this.split3;
      this.split2 = false;
    }
  }

  enableSplitPo() {
    this.split = !this.split;
  }


  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options2.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter3(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options3.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter3_2(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options3_2.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter3_3(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options3_3.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter4(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options4.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter5(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options5.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filtersplitn(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.optionssplitn.filter(option => option.toLowerCase().includes(filterValue));
  }

  u_worker = this.authService.getCredentials().naam
  u_land = this.authService.getCredentials().land
  u_klantnaam = ''
  u_klantnr = ''
  u_bedrag = ''
  u_bedrag_2 = '0'
  u_bedrag_3 = '0'
  u_omschrijving = ''
  u_merk = this.authService.getCredentials().sbu
  u_merk_2 = ''
  u_merk_3 = ''
  u_datum = new Date().toLocaleString("en-US", { month: "long" });
  u_potype = ''
  u_split_n = 2
  myJSONForm = {
  }

  onSubmit(f: NgForm) {
    this.open().then(() => {
      const now = new Date();

      this.myJSONForm = {
        timestamp: dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
        land: this.u_land,
        klantnaam: this.u_klantnaam,
        klantnr: this.u_klantnr,
        bedrag: this.u_bedrag,
        bedrag_2: this.u_bedrag_2,
        bedrag_3: this.u_bedrag_3,
        omschijving: this.u_omschrijving.replace(/'/g, ''),
        merk: this.u_merk,
        merk_2: this.u_merk_2,
        merk_3: this.u_merk_3,
        cc1: CCEMAILS.get('cc1'),
        cc2: CCEMAILS.get('cc2'),
        datum: this.u_datum,
        potype: this.u_potype,
        worker: this.u_worker
      };

      console.log(this.options2.includes(this.u_klantnaam));

      // console.log(this.myJSONForm)


      this.sendForms.sendForm(this.myJSONForm).subscribe(
        (res) => {
          alert(`U heeft met succes een aanvraag naar de verantwoordelijke gestuurd.

      Controleer uw e-mail voor het PO-nummer / Vous avez envoyé avec succès une demande à la personne responsable.

      Veuillez vérifier votre e-mail pour le numéro de PO`);
          this.exit = true;
        }, (err) => { alert(`Er is iets fout gegaan. Probeer het opnieuw. / Quelque chose s'est mal passé. Réessayer.`) }
      );

      // console.log(this.myJSONForm)

      setTimeout(() => {
        this.sent = true;
      }, 500);
    })
  }


  onCancel(f: NgForm) {
    this.u_bedrag = ''
    this.u_bedrag_2 = ''
    this.u_bedrag_3 = ''
    this.u_datum = ''
    this.u_klantnaam = ''
    this.u_klantnr = ''
    this.u_land = ''
    this.u_merk = ''
    this.u_merk_2 = ''
    this.u_split_n = NaN
    this.u_merk_3 = ''
    this.u_omschrijving = ''
    this.u_potype = ''
    this.u_worker = ''

    setTimeout(() => {
      this.router.navigate(['/homepage']);
    }, 2000);
  }

  getIP() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
