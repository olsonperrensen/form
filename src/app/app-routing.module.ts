import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AutocompleteFilterExampleComponent } from './autocomplete-filter-example/autocomplete-filter-example.component';
import { VendorComponent } from './vendor/vendor.component';
import { LoginComponent } from './login/login.component';
import { ManageComponent } from './manage/manage.component';
import { AuthGuardService } from './auth-guard.service';
import { HistoryComponent } from './history/history.component';
import { ActiveComponent } from './history/active/active.component';
import { ArchiveComponent } from './history/archive/archive.component';
import { VendorHistoryComponent } from './vendor/vendor-history/vendor-history.component';
import { PublicComponent } from './public/public.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ResetComponent } from './reset/reset.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: PublicComponent },
  { path: 'homepage', component: HomepageComponent, canActivate: [AuthGuardService] },
  { path: 'po', component: AutocompleteFilterExampleComponent, canActivate: [AuthGuardService] },
  { path: 'vendor', component: VendorComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'manage', component: ManageComponent, canActivate: [AuthGuardService] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuardService] },
  { path: 'active', component: ActiveComponent, canActivate: [AuthGuardService] },
  { path: 'archive', component: ArchiveComponent, canActivate: [AuthGuardService] },
  { path: 'vendor-history', component: VendorHistoryComponent, canActivate: [AuthGuardService] },
  { path: 'invoice', component: InvoiceComponent, canActivate: [AuthGuardService] },
  { path: 'reset', component: ResetComponent },
  { path: 'profile', component: ProfileComponent,canActivate: [AuthGuardService] }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
