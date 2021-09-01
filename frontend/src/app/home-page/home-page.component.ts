import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from "@angular/router";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"],
})
export class HomePageComponent implements OnInit {
//This component allows the a user to view their verified status
  bool:boolean
  constructor( public auth: AngularFireAuth,
    private router: Router,){

  }

  //id:string, user_id:string, name:string, req_price:number, contact_email:string, address:string, postcode:string,
  ngOnInit() {


  }
  send(){
    const us= this.auth.user.subscribe(user=>{
        user.sendEmailVerification()
    })
    alert('Sent')
    //Sends the verification email with firebase
  }
  async check(){
    let uid

    this.auth.authState.subscribe((user)=>{
      if(user){
        user.reload().then(()=>{
        console.log(user.emailVerified)
        this.bool=user.emailVerified
        uid=user.uid

        if(this.bool){
          console.log('as')
          console.log(this.bool)
          this.router.navigateByUrl(`/user/${uid}`)
        }
        else{
          console.log(uid)
          console.log(this.bool)
          alert('Not verified')
        }
      })//Checks if the user has verified their email

    }


  })

}
}
