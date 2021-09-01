import { Component, OnInit } from '@angular/core';
import { TimetableService } from "../timetable.service";
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import {AngularFireAuth} from '@angular/fire/auth'
import { NgForOf } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-user-page',
  templateUrl: './create-user-page.component.html',
  styleUrls: ['./create-user-page.component.css']
})
export class CreateUserPageComponent implements OnInit {
  form: FormGroup;
  action: 'login' | 'signup' = 'login'
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private timetableService:TimetableService,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      userID: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      fname: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      lname: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
  }) //A form for sign up. Validation of fields like email and password is done using firebase
  }
  async onButtonClicked(form: FormGroup){
    const {email, fname, lname, userID, password}= form.value
    let resp,uid
    try{
      if(this.isSignUp)
     {
      resp = await this.afAuth.createUserWithEmailAndPassword(email,password) //Creates user with firebase
      await resp.user.updateProfile({displayName: `${fname} ${lname} username: ${userID}`})//Updates displayname
      await resp.user.sendEmailVerification()//sends verification email
      form.reset()//resets form

      this.timetableService.tdUser(resp.user.uid,email,`${fname} ${lname} username: ${userID}`).subscribe((res)=>{
        this.router.navigateByUrl(`/home`)//adds the user to db and redirects them to home
      })
      }

    else{//if they are logging in
      let bool
      resp = await this.afAuth.signInWithEmailAndPassword(email,password)//signs them in with firebase
     bool= resp.user.emailVerified ? true: false  //checks if the user has a verified email

      if(bool){
        console.log('aseqew')
        console.log(bool)
        uid = resp.user.uid
        this.router.navigateByUrl(`/user/${uid}`)//If verified, go to the user profile
      }
      else{
        this.router.navigateByUrl('/home')//Else go to home
        console.log('Going home')

      }
    }


  }
    catch(error){
      if(error.code==="auth/user-disabled"){
        alert('Disabled account. Contact admin at a@a.com')
      }
      else alert(error)
      console.log(error.message)

    }
  }
  get isSignUp(){
    return this.action==='signup'
  }
  get isLogIn(){
    return this.action==='login'
  }

}
