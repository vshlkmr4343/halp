import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { DetailsComponent } from './details/details.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GetInTouchComponent } from './get-in-touch/get-in-touch.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';


const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'details/:id',
    component: DetailsComponent
  },
  {
    path: 'get-in-touch',
    component: GetInTouchComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent
  },
  {
    path: 'gallery',
    component: GalleryComponent
  },
  {
    path: 'gallery/:id',
    component: GalleryComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
