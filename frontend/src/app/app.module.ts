import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import{HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CoursesPageComponent } from './courses-page/courses-page.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DataFormComponent } from './data-form/data-form.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import {AngularFireModule} from '@angular/fire'
import {AngularFireAuthModule} from '@angular/fire/auth'
import { environment } from 'src/environments/environment';
import { CreateUserPageComponent } from './create-user-page/create-user-page.component';
import { MyListingsPageComponent } from './my-listings-page/my-listings-page.component';
import { NewListingPageComponent } from './new-listing-page/new-listing-page.component';
import { EditLisitingPageComponent } from './edit-lisiting-page/edit-lisiting-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PublicListPageComponent } from './public-list-page/public-list-page.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { SearchCourseComponent } from './search-course/search-course.component';
import { ListingFormComponent } from './listing-form/listing-form.component';
import {MarkdownModule} from 'ngx-markdown'
import { PolicyPageComponent } from './policy-page/policy-page.component';
import { NewPolicyComponent } from './new-policy/new-policy.component';
import { PolicyFormComponent } from './policy-form/policy-form.component';
import { EditPolicyComponent } from './edit-policy/edit-policy.component';
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    CoursesPageComponent,
    SchedulePageComponent,
    NavbarComponent,
    DataFormComponent,
    ScheduleFormComponent,
    CreateUserPageComponent,
    MyListingsPageComponent,
    NewListingPageComponent,
    EditLisitingPageComponent,
    LandingPageComponent,
    PublicListPageComponent,
    SearchCourseComponent,
    ListingFormComponent,
    PolicyPageComponent,
    NewPolicyComponent,
    PolicyFormComponent,
    EditPolicyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase)
    ,
    AngularFireAuthModule,
    MarkdownModule.forRoot(),


  ],
  providers: [AngularFireAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
