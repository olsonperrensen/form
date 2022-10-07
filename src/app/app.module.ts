import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MaterialModule } from './material/material.module';
import { AutocompleteFilterExampleComponent } from './autocomplete-filter-example/autocomplete-filter-example.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HomepageComponent } from './homepage/homepage.component';
import { AppRoutingModule } from './app-routing.module';
import { VendorComponent } from './vendor/vendor.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ManageComponent } from './manage/manage.component';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { HistoryComponent } from './history/history.component';
import { ActiveComponent } from './history/active/active.component';
import { ArchiveComponent } from './history/archive/archive.component';
import { VendorHistoryComponent } from './vendor/vendor-history/vendor-history.component';
import { PublicComponent } from './public/public.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ResetComponent } from './reset/reset.component';
import { ProfileComponent } from './profile/profile.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

export function HttpLoaderFactory(http:HttpClient)
{
  return new TranslateHttpLoader(http,'./assets/i18n/','.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AutocompleteFilterExampleComponent,
    HomepageComponent,
    VendorComponent,
    LoginComponent,
    HeaderComponent,
    ManageComponent,
    HistoryComponent,
    ActiveComponent,
    ArchiveComponent,
    VendorHistoryComponent,
    PublicComponent,
    InvoiceComponent,
    ResetComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      defaultLanguage: 'nl-NL',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxDropzoneModule
  ],
  providers: [AuthService,AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
