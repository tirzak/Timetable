import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimetableService } from '../timetable.service';
import { Result, ScheduleFull } from '../types';

@Component({
  selector: 'app-edit-lisiting-page',
  templateUrl: './edit-lisiting-page.component.html',
  styleUrls: ['./edit-lisiting-page.component.css']
})
export class EditLisitingPageComponent implements OnInit {
  ax : ScheduleFull
  namsse:string
  status:string
  descr: string
   id: any
  //axs: Result[]=[]
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private timetableService: TimetableService
  ) { }
//This component allows the user to make changes to a schedule
  ngOnInit(): void {
    this.namsse = ''
    this.id = this.route.snapshot.paramMap.get('id')//Gets the id from the route
    this.timetableService.getScheduleById(this.id).subscribe(
      (res)=>{
        this.ax=res
        this.namsse=this.ax.backname
        this.status=this.ax.status
        this.descr=this.ax.description
        if(this.descr==='0') this.descr=''
        console.log(this.descr)
      }
    )//Gets schedule by id
  }

  onSubmit(course){//Grabs the event from listing form and then makes the change using the timetable service
    this.timetableService
    .editSchedule(
      this.id,JSON.stringify(course)

    )
    .subscribe(
      (res) => {
        console.log('esss')
        this.router.navigateByUrl('/register-user')//Goes back to profile


      }
    );

  }

  }


