import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { Result, Scheduler } from "../types";
import { TimetableService } from "../timetable.service";
import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { element } from 'protractor';
@Component({
  selector: 'app-listing-form',
  templateUrl: './listing-form.component.html',
  styleUrls: ['./listing-form.component.css']
})
export class ListingFormComponent implements OnInit {
  @Input() toptext;
  @Input() sname=''
  @Input() status ='private'
  @Input() arr : Result[]=[]
  @Input() desc: string=''

  form: FormGroup;
  y: Scheduler;
  course: Scheduler[];
  isSuccessful: boolean;
  hasError: boolean=false;
  message: string ='';
  constructor(
    private fb: FormBuilder,

    private timetableService: TimetableService
  ) {}
  @Output() onSubmit = new EventEmitter<Scheduler[]>();

  ngOnInit() {
    this.isSuccessful=false
    this.course=[]
    this.form = this.fb.group({
      sname: [this.sname, Validators.required],
      status: [this.status],
      desc:[this.desc],
      items: this.fb.array([this.createField()]),
    });
    if(this.arr.length>0) this.createHelper()
  }
  createHelper(){
    this.remove()
    this.arr.forEach((element)=>{
      (this.form.controls["items"] as FormArray).push(this.fb.group({
        subjectCode: [element.subjectCode, Validators.required],
        courseCode: [element.courseCode, Validators.required],
      }));

    })
  }
  createField() {
    return this.fb.group({
      subjectCode: ["", Validators.required],
      courseCode: ["", Validators.required],
    });
  }
  get arrayC() {
    return this.form.get("items") as FormArray;
  }

  addNext() {
    (this.form.controls["items"] as FormArray).push(this.createField());
  }
  remove() {
    (this.form.controls["items"] as FormArray).removeAt(this.arrayC.length - 1);
  }

  submit() {
  //   try{
  //     console.log(this.arrayC.value)
  //   this.arrayC.value.forEach((element,index) => {
  //     this.y={
  //       name: this.form.get('sname').value,
  //       subjectCode: element[index].subjectCode,
  //       courseCode: element[index].courseCode

  //     }
  //     this.course.push(this.y)

  //   });
  this.course=[]
  let stat:boolean = this.form.get('status').value === 'private' ? false : true
  for (let i = 0; i < this.arrayC.length; i++) {
    this.y={
            description: this.form.get('desc').value,
            status: stat,
            name: this.form.get('sname').value,
            subjectCode: this.arrayC.value[i].subjectCode.replace(/\s/g, "").toUpperCase(),
            courseCode: this.arrayC.value[i].courseCode.replace(/\s/g, "").toUpperCase()

        }
        console.log(this.y)
       this.course.push(this.y)
      }

  console.log(JSON.stringify(this.course))
      this.onSubmit.emit(this.course)
  }




}
