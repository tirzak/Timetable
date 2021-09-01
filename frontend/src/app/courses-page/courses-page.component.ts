import { Component, OnInit } from '@angular/core';
import {Course} from '../types'
import {TimetableService} from '../timetable.service'
@Component({
  selector: 'app-courses-page',
  templateUrl: './courses-page.component.html',
  styleUrls: ['./courses-page.component.css']
})
export class CoursesPageComponent implements OnInit {
  courses: Course []=[];
  constructor(
    private timetableService: TimetableService,

  ) { }

  ngOnInit() {
    this.timetableService.getCourses()
    .subscribe(courses=>this.courses=courses) // Gets all courses
  }

}
