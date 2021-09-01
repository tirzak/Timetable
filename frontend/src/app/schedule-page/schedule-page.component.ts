import { Component, OnInit } from '@angular/core';
import { ScheduleView, ScheduleWC, TimeView } from "../types";
import {Router} from '@angular/router'
import {AngularFireAuth} from '@angular/fire/auth'
import { TimetableService } from "../timetable.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import firebase from 'firebase/app'
@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css']
})
export class SchedulePageComponent implements OnInit {

  form2: FormGroup;

  constructor(
    private timetableService: TimetableService,
    private router: Router,
    public afAuth: AngularFireAuth,

  ) { }

  ngOnInit() {
//This component allows the user to make changes to password

  this.form2 = new FormGroup({
    oldpass: new FormControl(
      "",
      Validators.compose([Validators.required])
    ),
    passchange: new FormControl(
      "",
      Validators.compose([Validators.required])
    ),
})
}


  async onButtonClicked(){
    let passwordold= this.form2.get('oldpass').value
    let newpass = this.form2.get('passchange').value

    try {
      const user = this.afAuth.authState.subscribe(
        (user)=>{
        if(user){
          const credentials = firebase.auth.EmailAuthProvider.credential(user.email,passwordold);//Creates a credential objects
           user.reauthenticateWithCredential(credentials).then(()=>{//Verifies old password
            user.updatePassword(newpass).then(()=>{//Updates the password
              this.router.navigateByUrl(`/user/${user.uid}`)//Goes to profile
            },
            (err)=>{
              alert(err)
            }
            )

          },
          (err)=>{
            console.log(err)
            alert("invalid old password")
          }
          )
        }
      }
      );


    }
    catch (error) {
      console.log(error)
      alert(error)
    }

}
}
