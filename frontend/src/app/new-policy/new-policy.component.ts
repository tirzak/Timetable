import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimetableService } from '../timetable.service';
import { PolContainer } from '../types';

@Component({
  selector: 'app-new-policy',
  templateUrl: './new-policy.component.html',
  styleUrls: ['./new-policy.component.css']
})
export class NewPolicyComponent implements OnInit {

  constructor(
    private router: Router
    ,private timetableService: TimetableService,
  ) { }
//This component allows the admin to make new policy. It depends on policy from component
  ngOnInit(): void {
  }

  onSubmit2(pol){//Grabs the event and adds the policy
    console.log(pol)
    let x=JSON.stringify(pol)
    this.timetableService
    .modifyPolicy(
      pol.policy,
      pol.id,


    )
    .subscribe(
      (res) => {


        this.router.navigateByUrl('/user-admin')//if theres a resp, goes to admin dashboard


      }
    );

  }

}
