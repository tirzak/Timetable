import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Review, SearchView } from "../types";
import { TimetableService } from "../timetable.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-search-course',
  templateUrl: './search-course.component.html',
  styleUrls: ['./search-course.component.css']
})
export class SearchCourseComponent implements OnInit {
  form: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  message: any = "";
  courseFound: boolean = false;
  hasError: boolean = false;
  expandDiv : boolean[] =[];
  timetables: SearchView[] = [];
  reviews: Review[]=[]
  u_uid:any
  constructor(
    public auth: AngularFireAuth,
    private timetableService: TimetableService,
  ) { }
//This component allows the everyone to make search for courses
  ngOnInit(): void {
    this.form = new FormGroup({
      subjectCode: new FormControl(
        ""
      ),
      courseCode: new FormControl(
        "",Validators.pattern('^[0-9 ]+$')
      ),
      suffix: new FormControl("",
      Validators.pattern('^[a-z,A-Z]{0,1}$')),

    });
    this.form.setValidators(this.customValidator())
    this.form2 = new FormGroup({
      reviewText: new FormControl(
        "",Validators.required
      )

    });
    this.form3 = new FormGroup({
      keywords: new FormControl(
        "",Validators.compose([Validators.required,Validators.minLength(4)])
      )

    });
    this.expandDiv=[false,false,false,false,false,false,false,false,false,false]
  }



  onButtonClicked(){
    let x =this.form.get("subjectCode").value + this.form.get("courseCode").value+this.form.get("suffix").value
    x = x.replace(/\s/g, "").toUpperCase()//Removes space and converts to upper case
    let sid=1
    if(this.form.get("subjectCode").value==='') sid =2
    console.log(x)
    this.timetableService
        .getSearchedCourse(
            x,sid

        )
        .subscribe(
          (res) => {
            if (this.hasError) this.hasError = false;
            this.timetables = res;
            this.courseFound = true;
          },
          (error) => {
            if (this.courseFound) this.courseFound = false;
            console.log(error);
            this.message = error;
            this.hasError=true;
          }
        );
  }
  onButtonClicked2(){
    let x =this.form3.get("keywords").value
    x = x.replace(/\s/g, "").toUpperCase()//Removes space and converts to upper case
    let sid=3

    console.log(x)
    this.timetableService
        .getSearchedCourseKeywords(
            x,sid

        )
        .subscribe(
          (res) => {
            if (this.hasError) this.hasError = false;
            this.timetables = res;
            this.courseFound = true;
          },
          (error) => {
            if (this.courseFound) this.courseFound = false;
            console.log(error);
            this.message = error;
            this.hasError=true;
          }
        );//Search using keywords
  }
  customValidator = () => {
    return (controlGroup) => {
        let controls = controlGroup.controls;
        if ( controls ) {
            let theOne = Object.keys(controls).find(key=> controls[key].value!=='');
            if ( !theOne ) {
                return {
                    atLeastOneRequired : {
                        text : 'At least one should be selected'
                    }
                }
            }
        }
        return null;
    };//Validates form
};
myFunction(element, id): void {
  if(!this.expandDiv[element]){
    this.timetableService
        .getReview(
            id

        )
        .subscribe(
          (res) => {
            this.reviews=res
          },
          (error) => {

            console.log(error);

          }
        );

    this.expandDiv[element]=true
  }//Gets review
else{

  this.expandDiv[element]=false
}//Hides details
}
addReview(id):void{
  console.log(id)
  this.timetableService
  .addReview(
      id, this.form2.get('reviewText').value

  )
  .subscribe(
    (res) => {

      console.log(res)
    },
    (error) => {

      console.log(error);

    }
  );//Adds review
  this.form2.reset()

}
getUid(){
  this.auth.user.subscribe(user=>{
    this.u_uid=user.uid
  })//Gets uid
}
}
