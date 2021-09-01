import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimetableService } from '../timetable.service';
import { PolContainer, Policies } from '../types';

@Component({
  selector: 'app-edit-policy',
  templateUrl: './edit-policy.component.html',
  styleUrls: ['./edit-policy.component.css']
})
export class EditPolicyComponent implements OnInit {
  text: string
  policyType: string
  policies: Policies
  constructor(

    private route: ActivatedRoute,
    private router: Router,
    private timetableService: TimetableService,
  ) { }
//This component allows the admin to make changes to policy
  ngOnInit(): void {
    let id =this.route.snapshot.paramMap.get('id')//gets the id from route
    this.timetableService.getPolicy().subscribe(
      (res)=>{
        this.policies=res[0]
        if(id==='1'){
          this.text=this.policies.aup
          this.policyType='aup'
        }
        else if(id==='2'){
          this.text=this.policies.privacy
          this.policyType='privacy'
        }
        else{
          this.text=this.policies.dmca
          this.policyType='dmca'
        }
        console.log(this.text)

      }
    )//Gets all the policy


  }
  onSubmit2(pol){ //Grabs the event from policy form and then uses the service to send it to backend
    console.log(pol)
    this.timetableService
    .modifyPolicy(

      pol.id,
      pol.policy,


    )
    .subscribe(
      (res) => {

        this.router.navigateByUrl('/user-admin')//If it gets a response, goes back to admin page


      }
    );

  }

}
