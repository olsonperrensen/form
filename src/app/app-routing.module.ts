import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AutocompleteFilterExampleComponent } from './autocomplete-filter-example/autocomplete-filter-example.component';
import { VendorComponent } from './vendor/vendor.component';
import { LoginComponent } from './login/login.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  {path:'',component:HomepageComponent},
  {path:'po',component:AutocompleteFilterExampleComponent},
  {path:'vendor',component:VendorComponent},
  {path:'login',component:LoginComponent},
  {path:'manage',component:ManageComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
