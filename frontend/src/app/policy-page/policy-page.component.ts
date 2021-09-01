import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimetableService } from '../timetable.service';
import { Policies } from '../types';

@Component({
  selector: 'app-policy-page',
  templateUrl: './policy-page.component.html',
  styleUrls: ['./policy-page.component.css']
})
export class PolicyPageComponent implements OnInit {
  isAup: boolean=false
  isPrivacy: boolean=false
  isDmca: boolean=false
  isWorkf: boolean=false
  policies: Policies
  id:any
  constructor(
    private timetableService: TimetableService,
    private activatedRoute: ActivatedRoute
  ) { }
//This component contains the policies.
/**
 *
 * This document does not repeat comments for similar operations. It is assumed that the reader is knowledgable enough to identify similar operations
 *
 */
  ngOnInit(): void {

    this.timetableService.getPolicy().subscribe(
      (res)=>{
        this.policies=res[0]

      }
    )//Gets the policies

    this.myFunction()
  }

  myFunction():void{
    this.id =this.activatedRoute.snapshot.paramMap.get('id')//Gets id from route
    if(this.id==='1'){
      this.isPrivacy=false
      this.isDmca=false
      this.isWorkf=false
      this.isAup=true//Displays AUP

    }
    else if(this.id==='2'){

      this.isDmca=false
      this.isAup=false
      this.isWorkf=false
      this.isPrivacy=true//Displays privacy

    }
    else if(this.id==='3'){
      this.isPrivacy=false
      this.isWorkf=false
      this.isAup=false
      this.isDmca=true//Displays DMCA

    }
    else{
      this.isPrivacy=false

      this.isAup=false
      this.isDmca=false
      this.isWorkf=true//Displays workflow
    }
  }
  myFunction2(id):void{
  if(id===1){
    this.isPrivacy=false
    this.isDmca=false
    this.isWorkf=false
    this.isAup=true

  }
  else if(id===2){

    this.isDmca=false
    this.isAup=false
    this.isWorkf=false
    this.isPrivacy=true

  }
  else if(this.id===3){
    this.isPrivacy=false
    this.isWorkf=false
    this.isAup=false
    this.isDmca=true

  }
  else{
    this.isPrivacy=false

    this.isAup=false
    this.isDmca=false
    this.isWorkf=true
  }
}


}
