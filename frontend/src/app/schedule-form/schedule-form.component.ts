import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Review, ReviewAdm, Scheduler, UserProfile } from "../types";
import { TimetableService } from "../timetable.service";
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: "app-schedule-form",
  templateUrl: "./schedule-form.component.html",
  styleUrls: ["./schedule-form.component.css"],
})
export class ScheduleFormComponent implements OnInit {

  users: UserProfile[]
  reviews: ReviewAdm[]=[]
  form: FormGroup;

  constructor(private fb: FormBuilder,public auth: AngularFireAuth,
    private afs: AngularFirestore, private timetableService: TimetableService) {


  }
//This component is the admin dashboard
  ngOnInit() {
    this.getUser()
    this.adminReviews()
    this.form = this.fb.group({
      type: ['', Validators.required],
      reviewid: ['',Validators.required],
      date:['',Validators.required]

    });

  }
  getUser(){
    this.timetableService.getAdmin().subscribe((res)=>{
      this.users=res
    })//Gets userlist
  }
  addAdmins(userid, id){
    console.log(userid)
    if(id===1){
    this.timetableService.addAdminF(userid,id).subscribe((res)=>{
      this.getUser()
    })}//Adds admin
    else{
      this.timetableService.addAdminF(userid,id).subscribe((res)=>{
        this.getUser()
      })
    }//Revokes admin


  }



  disable(userid,id){
    console.log(id)
    if(id===2){
      console.log('Activate')
      this.timetableService.activateAccount(userid).subscribe(()=>{
        this.getUser()
      })
    }//Disables acoount
    else{
      console.log('Deactivate')
      this.timetableService.deactivateAccount(userid).subscribe((res)=>{
        this.getUser()


      })//Enables account

  }
}
  adminReviews():void{
    this.timetableService
    .getAdminReview(


    )
    .subscribe(
      (res) => {
        this.reviews=res
      },
      (error) => {

        console.log(error);

      }
    );//Gets all reviews on the app
  }

hideCourse(courseid,par):void{
  if(par===1){
    this.timetableService.modifyAdminReview(courseid,par).subscribe((res)=>{
      this.adminReviews()
    })
  }//Hides reiveew
  else{
    this.timetableService.modifyAdminReview(courseid,2).subscribe((res)=>{
      this.adminReviews()
    })
  }//Makes the review visible

}

disputesubmit():void{
  this.auth.authState.subscribe(user=>{
    if(user){
      let item = {
        userid: user.uid,
        reviewid: this.form.get('reviewid').value,
        date: this.form.get('date').value,
        type: this.form.get('type').value,


      }
      this.timetableService.postDMCAlog(item).subscribe(
        (res)=>{
          this.form.reset()
        }
      )//Logs a dmca request
    }
  })


}
}



