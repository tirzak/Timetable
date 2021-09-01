import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth'
import firebase from 'firebase/app'
import {Router} from '@angular/router'
import { TimetableService } from '../timetable.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  u_uid:any
  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private timetableService:TimetableService,

  ) { }
    email:any
    display:any
    isAadmin:boolean
//This component os the navbar
  ngOnInit() {
    this.u_uid=""
    this.getUid()

  }

  getUid(){//Gets uid of the logged user
    this.auth.authState.subscribe(user=>{
      if(user){
      this.u_uid=user.uid
      this.email=user.email
      this.display=user.displayName
      user.getIdTokenResult().then((res)=>{
        this.isAadmin=res.claims.admin===true
      })
      }
    })
  console.log("Hello")
  console.log(this.u_uid)

  }
  goToProfile(){
    this.router.navigateByUrl(`/user/${this.u_uid}`)
  }
  async signInGoogle(){//Allows sign in with google
    const user=await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(()=>{
    this.getUid()
    this.timetableService.tdUser(this.u_uid,this.email,this.display)//Adds the user to db
    .subscribe((res)=>{
      this.router.navigateByUrl(`/user/${this.u_uid}`)//Goes to the profile
    })
  })
}
  signOutClicked(){
    this.auth.signOut()//signs the user out
    this.router.navigateByUrl('/')//Sends them to the first page
  }

}
