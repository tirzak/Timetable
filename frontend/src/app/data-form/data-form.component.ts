import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { Schedule, TimeView } from "../types";
import { TimetableService } from "../timetable.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
@Component({
  selector: "app-data-form",
  templateUrl: "./data-form.component.html",
  styleUrls: ["./data-form.component.css"],
})

export class DataFormComponent implements OnInit {
  form: FormGroup;
  form2: FormGroup;

  isSuccessful: boolean = false;
  courseFound: boolean = false;
  name: string = "";
  message: any = "";
  hasError: boolean = false;
  hasError2: boolean = false;
  timetables: TimeView[] = [];
  @Output() onSubmit = new EventEmitter<Schedule>();
  constructor(
    private router: Router,
    private timetableService: TimetableService
  ) {}
  //id:string, user_id:string, name:string, req_price:number, contact_email:string, address:string, postcode:string,
  //This component allows one to view timetable information course or create a schedule. This form is not reachable anymore
  ngOnInit() {
    this.form = new FormGroup({
      subjectCode: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      courseCode: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      component: new FormControl(""),
    });
    this.form2 = new FormGroup({
      name: new FormControl(""),
    });
  }
  onButtonClicked() {
    this.timetableService
      .createSchedule(this.form2.get("name").value)
      .subscribe(
        (res) => {
          if (this.hasError) this.hasError = false;
          this.isSuccessful = true;
        },
        (error) => {
          if (this.isSuccessful) this.isSuccessful = false;

          this.message = error;
          this.hasError = true;
        }
      );
  }
  onButtonClicked2() {
    if (this.form.get("component").value == "") {
      this.timetableService
        .getTimetable(
          this.form.get("subjectCode").value,
          this.form.get("courseCode").value
        )
        .subscribe(
          (res) => {
            if (this.hasError2) this.hasError2 = false;
            this.timetables = res;
            this.courseFound = true;
          },
          (error) => {
            if (this.courseFound) this.courseFound = false;
            console.log(error);
            this.message = error;
            this.hasError2=true;
          }
        );
    }
    else {
      this.timetableService
        .getTimetable2(
          this.form.get("subjectCode").value,
          this.form.get("courseCode").value,
          this.form.get("component").value
        )
        .subscribe(
          (res) => {
            if (this.hasError2) this.hasError2 = false;
            this.timetables = res;
            this.courseFound = true;
          },
          (error) => {
            if (this.courseFound) this.courseFound = false;
            console.log("error");
            this.message = error;
            this.hasError2=true;
          }
        );
    }
  }
  hider() {
    this.courseFound = false;
  }
}
