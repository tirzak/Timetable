import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimetableService } from '../timetable.service';

@Component({
  selector: 'app-new-listing-page',
  templateUrl: './new-listing-page.component.html',
  styleUrls: ['./new-listing-page.component.css']
})
export class NewListingPageComponent implements OnInit {
  hasError: boolean=false;
  message: string ='';
  constructor(
    private router: Router
    ,private timetableService: TimetableService,
  ) { }

  ngOnInit(): void {
  }
//This component allows the user to make a new listing. This one depends on listing form component
  onSubmit(course){//Grabs the event and adds the schedule
    this.timetableService
    .addToSchedule(
      JSON.stringify(course)

    )
    .subscribe(
      (res) => {
        if (this.hasError) this.hasError = false;
        this.router.navigateByUrl('/register-user')//If theres a resp then goes to profile


      }
    );

  }

  }


