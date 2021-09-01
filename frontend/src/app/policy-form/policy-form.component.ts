import { Component,EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TimetableService } from "../timetable.service";
import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { PolContainer } from '../types';
@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.css']
})

export class PolicyFormComponent implements OnInit {
  @Input() textqqq:string=';kl;k;'//Allows setting value from a diff component
  @Input() newF: boolean= true
  @Input() policyType: string=''
  form: FormGroup;
  constructor(
    private fb: FormBuilder,

    private timetableService: TimetableService
  ) {}
  @Output() onSubmit2 = new EventEmitter<PolContainer>();//Emits the form data
  ngOnInit(): void {
    this.form = this.fb.group({
      sname: [this.textqqq, Validators.required],
      status: [this.policyType],

    });
  }
  submit():void{
    let stat:string = this.policyType === 'privacy'  ? '2':this.policyType ==='aup'?'1' : '3'
    let y:PolContainer= {//k==0 ? 'LEC': k==1 ?'LAB' : 'TUT'
      id: stat,
      policy: this.form.get('sname').value
    }
    this.onSubmit2.emit(y)//emits the object y
    console.log(this.form.get('status').value)
  }


}
