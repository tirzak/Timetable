import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AngularFireAuthGuard, redirectUnauthorizedTo,customClaims} from '@angular/fire/auth-guard'

import { CoursesPageComponent } from './courses-page/courses-page.component';
import { CreateUserPageComponent } from './create-user-page/create-user-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MyListingsPageComponent } from './my-listings-page/my-listings-page.component';
import { PublicListPageComponent } from './public-list-page/public-list-page.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { map } from 'rxjs/operators';
import { SearchCourseComponent } from './search-course/search-course.component';
import { NewListingPageComponent } from './new-listing-page/new-listing-page.component';
import { EditLisitingPageComponent } from './edit-lisiting-page/edit-lisiting-page.component';
import { pipe } from 'rxjs';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { PolicyPageComponent } from './policy-page/policy-page.component';
import { NewPolicyComponent } from './new-policy/new-policy.component';
import { EditPolicyComponent } from './edit-policy/edit-policy.component';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['register-user'])

const redirectToProfile=()=>
  map(user => user ? ['user',(user as any).uid]:true);
  const onlyAllowSelf = next =>
  map(
    user => (!!user && next.params.id == (user as any).uid) || ['register-user']
  );
  const adminOnly = ()=> pipe(
    customClaims, map(claims=> claims.admin===true||[''])
    )//Allows only admin to these routes
  const routes: Routes = [

  {path: 'home', component: HomePageComponent, pathMatch: 'full'},
  {path: 'courses', component: CoursesPageComponent, pathMatch: 'full'},
  {path: 'schedules', component: SchedulePageComponent, pathMatch: 'full',canActivate: [AngularFireAuthGuard], data:{authGuardPipe: redirectUnauthorizedToLogin}},//Blocks unauthorized users and directs them to login
  {path: 'register-user', component: CreateUserPageComponent, pathMatch: 'full',canActivate: [AngularFireAuthGuard], data:{authGuardPipe: redirectToProfile}},
  {path: 'user/:id', component: MyListingsPageComponent,canActivate: [AngularFireAuthGuard], data:{authGuardPipe: onlyAllowSelf}},//Only allows specific user
  {path: '', component: LandingPageComponent, pathMatch: 'full'},
  {path: 'listings', component: PublicListPageComponent, pathMatch: 'full'},
  {path: 'courseview', component: SearchCourseComponent, pathMatch: 'full'},
  {path: 'policy/:id', component: PolicyPageComponent, pathMatch: 'full'},
  {path: 'new-listing', component: NewListingPageComponent, pathMatch: 'full',canActivate:[AngularFireAuthGuard], data:{authGuardPipe: redirectUnauthorizedToLogin}},
  {path: 'edit-listing/:id', component: EditLisitingPageComponent, pathMatch: 'full',canActivate:[AngularFireAuthGuard], data:{authGuardPipe: redirectUnauthorizedToLogin}},
  {path: 'user-admin', component: ScheduleFormComponent, pathMatch: 'full',canActivate:[AngularFireAuthGuard], data:{authGuardPipe: adminOnly}},
  {path: 'new-policy', component: NewPolicyComponent, pathMatch: 'full',canActivate:[AngularFireAuthGuard], data:{authGuardPipe: adminOnly}},
  {path: 'edit-policy/:id', component: EditPolicyComponent, pathMatch: 'full',canActivate:[AngularFireAuthGuard], data:{authGuardPipe: adminOnly}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
