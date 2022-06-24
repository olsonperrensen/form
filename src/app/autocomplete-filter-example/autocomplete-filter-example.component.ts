import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { SendFormsService } from '../send-forms.service';
import {TooltipPosition} from '@angular/material/tooltip';
import { IpServiceService } from '../ip-service.service';
import * as a from 'angular-animations';
import { GetdataService } from '../getdata.service';

@Component({
  selector: 'app-autocomplete-filter-example',
  templateUrl: './autocomplete-filter-example.component.html',
  styleUrls: ['./autocomplete-filter-example.component.css'],
  animations:[
    a.fadeInLeftOnEnterAnimation(),
    a.fadeInOnEnterAnimation(),
    a.fadeInRightOnEnterAnimation()
  ]
})
export class AutocompleteFilterExampleComponent implements OnInit {

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
  options3: string[] = ["DEWALT/LENOX","STANLEY","FACOM","BOSTITCH"];
  options4: string[] = ["Januari","Februari","Maart","April","Mei","Juni",
"Juli","Augustus","September","Oktober","Novermber","December"];
options5: string[] = ["België / Belgique","Nederland / Pays Bas"];
options6: string[] = [
  // DeWALT
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
  "Kevin Markestein","David Goubert","Gunther Mergan","Jurgen De Leeuw","Thomas Molendijk","Marcelino Papperse","Andor De Vries","Ivo Schouten",
  // Facom
  "Patrick Diepenbach", 
  "Piet Verstraete","Vincent Broertjes","Jean-Christophe Pintiaux","Kim Maris","Mario Reverse","Peter Schaekers","Robin Roels","Stefan Sack","Vincent Lenain","Vincent Pireyn","Yves De Waal","Adriaan Arkeraats","Arno De Jager","Duncan DeWith",
// Stanley
"Ken Leysen","Martin Van Werkhoven","Paul Kerkhoven","Cedric Bicque","Christian Fonteyn","Klaas Jan Bosgraaf","Ammaar Basnoe","Robert Van Straten","Sven Pieters","Niek Nijland"];
options7: string[] = ["Pro","Consumer"];
options8: string[] = ["Geert Maes","Marleen Vangronsveld","Marlon Van Zundert","Michael Soenen","Michael Tistaert","Ronald Westra","Vicky De Decker","Christelle Marro","Frederic Barzin","Luc Claes","Marc Ghijs","Ronny Callewaert","Hendrik Pieters","Malvin Puts","Niels Groters","Remco Rozing ","Eric Nieuwmans"];


deWALT_employees = [
  // DeWALT
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
  "Oscar Laureijs",  "Kevin Markestein","David Goubert","Gunther Mergan","Jurgen De Leeuw","Thomas Molendijk","Marcelino Papperse","Andor De Vries","Ivo Schouten - Sales Manager DW NL"];
  facom_employees = ["Patrick Diepenbach", 
  "Piet Verstraete","Vincent Broertjes","Jean-Christophe Pintiaux","Kim Maris","Mario Reverse","Peter Schaekers","Robin Roels","Stefan Sack","Vincent Lenain","Vincent Pireyn","Yves De Waal","Adriaan Arkeraats","Arno De Jager","Duncan DeWith"];
  stanley_employees = ["Ken Leysen","Martin Van Werkhoven","Paul Kerkhoven","Cedric Bicque","Christian Fonteyn","Klaas Jan Bosgraaf","Ammaar Basnoe","Robert Van Straten","Sven Pieters","Niek Nijland"];

  filteredOptions!: Observable<string[]>;
  filteredOptions2!: Observable<string[]>;
  filteredOptions3!: Observable<string[]>;
  filteredOptions4!: Observable<string[]>;
  filteredOptions5!: Observable<string[]>;
  filteredOptions6!: Observable<string[]>;
  filteredOptions7!: Observable<string[]>;
  filteredOptions8!: Observable<string[]>;

  ipAddress = ''; 

  constructor(private sendForms:SendFormsService,private ip:IpServiceService,
    private getData:GetdataService){}

  ngOnInit() { 
    this.getIP(); 
    this.getData.getClients().subscribe((res:any)=>this.options2 = res.sort())
    
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
    this.myControl6.valueChanges.subscribe((res)=>{
      if(this.deWALT_employees.find((obj) => {return obj.toLowerCase() === res.toLowerCase();}))
      {
        this.u_merk = this.options3[0];
        this.isWorker = true;
      }
      else if(this.stanley_employees.find((obj) => {return obj.toLowerCase() === res.toLowerCase();}))
      {
        this.u_merk = this.options3[1];
        this.isWorker = true;
      }
      else if(this.facom_employees.find((obj) => {return obj.toLowerCase() === res.toLowerCase();}))
      {
        this.u_merk = this.options3[2];
        this.isWorker = true;
      }
      else
      {
        this.u_merk = "";
        this.isWorker = false;
      }
    });
    this.myControl3.valueChanges.subscribe((res)=>{
      switch(res.toLowerCase()) {
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
    this.myControl2.valueChanges.subscribe((res)=>{
      // Exact match full klant 
      if(this.options2.find((obj) => {return obj.toLowerCase() === res.toLowerCase();})
      &&!this.isNewVendor&&this.isLand)
      {
        this.isKlant = true;
      }
      else
      {
        this.isKlant = false;
      }
    });
    this.myControl9.valueChanges.subscribe((res)=>{
      if(res >= 50 && res <= 89000 && this.isKlant)
      {
        this.isBedrag = true;
      }
      else
      {
        this.isBedrag = false;
      }
    });
    this.myControl10.valueChanges.subscribe((res)=>{
      if(res.length > 4 && this.isBedrag)
      {
        this.isOmschrijving = true;
      }
      else
      {
        this.isOmschrijving = false;
      }
    })
  }

  potype()
  {
    if(this.u_potype === "Pro")
    {
      this.isPro = true;
      this.isConsumer = false;
    }
    else if (this.u_potype === "Consumer")
    {
      this.isConsumer = true;
      this.isPro = false;
    }
  }
  klant()
  {
    if(this.u_klantnaam.includes("B/")||this.u_klantnaam.toUpperCase().includes('INACTIVE'))
    {
      this.isOutdatedVendor = true;
    }
    else
    {
      this.isOutdatedVendor = false;
    }
    if(!this.options2.includes(this.u_klantnaam) && this.u_klantnaam.length > 3)
    {
      this.isNewVendor = true;
    }
    else
    {
      this.isNewVendor = false;
    }
  }
  landtype()
  {
    if(this.isVerkoper)
    {
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

  onSubmit(f:NgForm)
  {

    this.myJSONForm = {
      timestamp: new Date().toISOString(),    
      land:this.u_land,
      klantnaam:this.u_klantnaam,
      klantnr:this.u_klantnr,
      bedrag:this.u_bedrag,
      omschijving:this.u_omschrijving,
      merk:this.u_merk,
      datum:this.u_datum,
      potype:this.u_potype,
      worker:this.u_worker
    };
    
      console.log(    this.options2.includes(this.u_klantnaam));

    this.sendForms.sendForm(this.myJSONForm).subscribe(
      (res)=>{
        alert(`U heeft met succes een aanvraag naar de verantwoordelijke gestuurd.

      Controleer uw e-mail voor het PO-nummer / Vous avez envoyé avec succès une demande à la personne responsable.

      Veuillez vérifier votre e-mail pour le numéro de PO`);
      this.exit = true;},(err)=>{alert(`Er is iets fout gegaan. Probeer het opnieuw. / Quelque chose s'est mal passé. Réessayer.`)}
    );

    setTimeout(() => {
      this.sent = true;
    }, 500);
  }
  getIP()  
  {  
    this.ip.getIPAddress().subscribe((res:any)=>{  
      this.ipAddress=res.ip;  
    });  
  }  
}
