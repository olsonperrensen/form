import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { AutocompleteFilterExampleComponent } from './autocomplete-filter-example/autocomplete-filter-example.component';
import { HeaderComponent } from './header/header.component';
import { ActiveComponent } from './history/active/active.component';
import { ArchiveComponent } from './history/archive/archive.component';
import { HistoryComponent } from './history/history.component';
import { HomepageComponent } from './homepage/homepage.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { LoginComponent } from './login/login.component';
import { ManageComponent } from './manage/manage.component';
import { MaterialModule } from './material/material.module';
import { ProfileComponent } from './profile/profile.component';
import { PublicComponent } from './public/public.component';
import { ResetComponent } from './reset/reset.component';
import { VendorHistoryComponent } from './vendor/vendor-history/vendor-history.component';
import { VendorComponent } from './vendor/vendor.component';
import { CommonModule } from '@angular/common';
import { LogComponent } from './log/log.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthInterceptor } from './auth.interceptor';
import { ChangelogComponent } from './changelog/changelog.component';
import { FilterpoComponent } from './history/filterpo/filterpo.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MultiComponent } from './multi/multi.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
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
    ProfileComponent,
    LogComponent,
    ChangelogComponent,
    FilterpoComponent,
    MultiComponent,
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
        deps: [HttpClient],
      },
    }),
    NgxDropzoneModule,
    CommonModule,
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    AuthGuardService,
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
