import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimetableService } from '../timetable.service';
import { SchedList, ScheduleFull, ScheduleView, TimeView } from '../types';

@Component({
  selector: 'app-public-list-page',
  templateUrl: './public-list-page.component.html',
  styleUrls: ['./public-list-page.component.css']
})
export class PublicListPageComponent implements OnInit {
  expandDiv: boolean[]
  listings: SchedList[]=[]
  timeView: any[]=[]
  times: any[]=[]
  timetables: TimeView[]=[];
  scheduledet: ScheduleFull;
  id: any
  constructor(
    private timetableService: TimetableService
  ) { }

  ngOnInit(): void {
    this.times=[]
    this.expandDiv=[false,false,false,false,false,false,false,false,false,false]
    this.updateVal()
  }
  updateVal():void{
    this.timetableService.getSchedule().subscribe(
      (res)=>{
      this.listings=res
      console.log(res)
      }

    )
  }
  onViewClicked(element,scheduleid): void{
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

    )
  }
  else{
    this.expandDiv[element]=false
  }
    console.log(this.times)
  }
  time(subjectCode: string, courseCode: string){

    this.timetableService.getTimetable(subjectCode,courseCode).subscribe(
      res => this.times.push(res)
    )

  }


}
