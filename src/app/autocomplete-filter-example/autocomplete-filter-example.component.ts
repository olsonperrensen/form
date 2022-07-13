import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SendFormsService } from '../send-forms.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { IpServiceService } from '../ip-service.service';
import * as a from 'angular-animations';
import { GetdataService } from '../getdata.service';
import { Router } from '@angular/router';
import dateFormat, { masks } from "dateformat";

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
export class AutocompleteFilterExampleComponent implements OnInit, AfterViewInit {

  sent = false;
  exit = false;


  isPro = false;
  isConsumer = false;

  isWorker = false;
  isVerkoper = false;

  isLand = false;
  isKlant = false;
  isBedrag = false;
  isOmschrijving = false;

  isNewVendor = false;
  isOutdatedVendor = false;

  isBackendDown = false;

  myControl = new FormControl();
  myControl2 = new FormControl();
  myControl3 = new FormControl();
  myControl4 = new FormControl();
  myControl5 = new FormControl();
  myControl6 = new FormControl();
  myControl7 = new FormControl();
  myControl8 = new FormControl();
  myControl9 = new FormControl();
  myControl10 = new FormControl();

  options2!: string[];
  options3: string[] = ["DeWALT – LENOX – BOSTITCH", "STANLEY", "FACOM"];
  options4: string[] = ["Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "Oktober", "Novermber", "December"];
  options5: string[] = ["België / Belgique", "Nederland / Pays Bas"];
  options6: string[] = [
    // DeWALT
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
    "Oscar Laureijs",
    "Kevin Markestein", "David Goubert", "Gunther Mergan", "Jurgen DeLeeuw", "Thomas Molendijk",
    "Marcelino Papperse", "Andor DeVries", "Ivo Schouten", "Patrick Diepenbach",
    // Facom
    "Piet Verstraete", "Vincent Broertjes", "Jean-Christophe Pintiaux", "Kim Maris", "Mario Reverse",
    "Peter Schaekers", "Robin Roels", "Stefan Sack", "Vincent Lenain", "Vincent Pireyn", "Yves DeWaal",
    "Adriaan Arkeraats", "Arno DeJager", "Duncan DeWith",
    // Stanley
    "Ken Leysen", "Martin Van Werkhoven", "Paul Kerkhoven", "Cedric Bicque", "Christian Fonteyn",
    "KlaasJan Bosgraaf", "Ammaar Basnoe", "Robert VanStraten", "Sven Pieters", "Niek Nijland"];
  options7: string[] = ["Pro", "Consumer"];
  options8: string[] = ["Geert Maes", "Marleen Vangronsveld", "Marlon VanZundert", "Michael Soenen",
    "Michael Tistaert", "Ronald Westra", "Vicky DeDecker", "Christelle Marro", "Frederic Barzin", "Luc Claes",
    "Marc Ghijs", "Ronny Callewaert", "Hendrik Pieters", "Malvin Puts", "Niels Groters", "Remco Rozing ",
    "Eric Nieuwmans"];


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
    "Thomas Molendijk", "Marcelino Papperse", "Andor DeVries", "Ivo Schouten - Sales Manager DW NL"];
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
  filteredOptions4!: Observable<string[]>;
  filteredOptions5!: Observable<string[]>;
  filteredOptions6!: Observable<string[]>;
  filteredOptions7!: Observable<string[]>;
  filteredOptions8!: Observable<string[]>;

  ipAddress = '';

  constructor(private sendForms: SendFormsService, private ip: IpServiceService,
    private getData: GetdataService, private router: Router) { }

  ngOnInit() {
    document.body.style.backgroundImage = "url('https://i.postimg.cc/8NqcDrfY/Default-Wallpaper.png')"
    this.getIP();
    this.isBackendDown = this.getData.getBackendBoolean()
    this.filteredOptions2 = this.myControl2.valueChanges.pipe(
      startWith(''),
      map(value => this._filter2(value)),
    );
    this.filteredOptions3 = this.myControl3.valueChanges.pipe(
      startWith(''),
      map(value => this._filter3(value)),
    );
    this.filteredOptions4 = this.myControl4.valueChanges.pipe(
      startWith(''),
      map(value => this._filter4(value)),
    );
    this.filteredOptions5 = this.myControl5.valueChanges.pipe(
      startWith(''),
      map(value => this._filter5(value)),
    );
    this.filteredOptions6 = this.myControl6.valueChanges.pipe(
      startWith(''),
      map(value => this._filter6(value)),
    );
    this.filteredOptions7 = this.myControl7.valueChanges.pipe(
      startWith(''),
      map(value => this._filter7(value)),
    );
    this.filteredOptions8 = this.myControl8.valueChanges.pipe(
      startWith(''),
      map(value => this._filter8(value)),
    );

    // Own Observables

    // Consumer
    this.myControl8.valueChanges.subscribe((res) => {
      if (this.options8.find((obj) => { return obj.toLowerCase() === res.toLowerCase(); })) {
        this.u_merk = this.options3[1];
        this.isWorker = true;
      }
      else {
        this.u_merk = "";
        this.isWorker = false;
      }
    });
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
          default:
            break;
        }
        this.isLand = true;
      }, 600);
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
    this.myControl9.valueChanges.subscribe((res) => {
      if (res >= 50 && res <= 89000 && this.isKlant) {
        this.isBedrag = true;
      }
      else {
        this.isBedrag = false;
      }
    });

    this.myControl10.valueChanges.subscribe((res) => {
      if (res.length > 4 && this.isBedrag) {
        this.isOmschrijving = true;
      }
      else {
        this.isOmschrijving = false;
      }
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
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
        // alert("Press F5 to continue.")
      });
    }, 2777);
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
    // console.log(`isKlant: ${this.isKlant}
    // isLand: ${this.isLand}
    // isVerkoper: ${this.isVerkoper}
    // isWorker: ${this.isWorker}
    // isNewVendor: ${this.isNewVendor}
    // isLand: ${this.isLand}`)
  }

  landtype() {
    if (this.isVerkoper) {
      this.isLand = true;
    }
  }


  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options2.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter3(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options3.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter4(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options4.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter5(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options5.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter6(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options6.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter7(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options7.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filter8(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options8.filter(option => option.toLowerCase().includes(filterValue));
  }

  u_worker = ''
  u_land = ''
  u_klantnaam = ''
  u_klantnr = ''
  u_bedrag = ''
  u_omschrijving = ''
  u_merk = ''
  u_datum = ''
  u_potype = ''
  myJSONForm = {
  }

  onSubmit(f: NgForm) {
    const now = new Date();

    this.myJSONForm = {
      timestamp: dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
      land: this.u_land,
      klantnaam: this.u_klantnaam,
      klantnr: this.u_klantnr,
      bedrag: this.u_bedrag,
      omschijving: this.u_omschrijving,
      merk: this.u_merk,
      datum: this.u_datum,
      potype: this.u_potype,
      worker: this.u_worker
    };

    console.log(this.options2.includes(this.u_klantnaam));

    this.sendForms.sendForm(this.myJSONForm).subscribe(
      (res) => {
        alert(`U heeft met succes een aanvraag naar de verantwoordelijke gestuurd.

      Controleer uw e-mail voor het PO-nummer / Vous avez envoyé avec succès une demande à la personne responsable.

      Veuillez vérifier votre e-mail pour le numéro de PO`);
        this.exit = true;
      }, (err) => { alert(`Er is iets fout gegaan. Probeer het opnieuw. / Quelque chose s'est mal passé. Réessayer.`) }
    );

    setTimeout(() => {
      this.sent = true;
    }, 500);
  }

  onCancel(f: NgForm) {
    this.u_bedrag = ''
    this.u_datum = ''
    this.u_klantnaam = ''
    this.u_klantnr = ''
    this.u_land = ''
    this.u_merk = ''
    this.u_omschrijving = ''
    this.u_potype = ''
    this.u_worker = ''

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }

  getIP() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
