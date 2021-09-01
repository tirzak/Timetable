import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { TimetableService } from '../timetable.service';
import { SchedList, ScheduleFull, ScheduleView, TimeView } from '../types';

@Component({
  selector: 'app-my-listings-page',
  templateUrl: './my-listings-page.component.html',
  styleUrls: ['./my-listings-page.component.css']
})
export class MyListingsPageComponent implements OnInit {
//This component allows the user to view details about themselves
  expandDiv: boolean[]
  listings: SchedList[]=[]
  timeView: any[]=[]
  times: any[]=[]
  timetables: TimeView[]=[];
  scheduledet: ScheduleFull;
  id: any
  constructor(public afAuth : AngularFireAuth,
    private route: ActivatedRoute,
    public router: Router,
    private timetableService: TimetableService) { }

  ngOnInit(): void {
    this.times=[]
    this.expandDiv=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
    this.updateVal()

  }
  updateVal():void{
    this.timetableService.getScheduleForUser().subscribe(
      (res)=>{
      this.listings=res
      console.log(res)
      }

    )//Grabs schedules for a user
  }
  onDeleteClicked(scheduleid){
    let bool= confirm('Are you sure?')//asks for confirmation before deleting
    if(bool)
{    this.timetableService
    .deleteASchedule(
      scheduleid,

    )
    .subscribe(
      (res) => {
        console.log("hellosss")

        this.updateVal()
      },
      (error) => {

        console.log("error");
        alert(error)
      }

    );}//Deletes the schedule
  }
  onViewClicked(element,scheduleid){
    this.times=[]
    this.updateVal()
    if(!this.expandDiv[element]){
    this.timetableService.getScheduleById(scheduleid)
    .subscribe(res=>{

      this.scheduledet=res

      this.timeView = this.scheduledet.courseArray
      this.timeView.forEach((a)=>{
        this.time(a.subjectCode,a.courseCode)
      })
      this.expandDiv[element]=true

    }

    )//Lets the user view timetable information for all the stored courses
  }
  else{
    this.expandDiv[element]=false
  }
    console.log(this.times)
  }
  time(subjectCode: string, courseCode: string){

    this.timetableService.getTimetable(subjectCode,courseCode).subscribe(
      res => this.times.push(res)
    )//Gets the timetable value

  }

}
