import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { observable, Observable, throwError } from "rxjs";
import { catchError} from "rxjs/operators";
import { Course, ScheduleView, ScheduleWC, TimeView,SearchView, Review, ScheduleFull, SchedList, UserProfile, ReviewAdm, Policies } from "./types";
import { Time } from '@angular/common';
import {AngularFireAuth} from '@angular/fire/auth'
import { Router } from '@angular/router';
import { stringify } from 'querystring';
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
const httpOptionsWithAuthToken = token => ({//For authorized requests
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'AuthToken': token,
  })
});
@Injectable({
  providedIn: "root",
})
export class TimetableService {

/**
 *This component has all the services used by different components for backend communications
 * This document does not repeat comments for similar operations. It is assumed that the reader is knowledgable enough to identify similar operations
 * .pipe() is used to pipe a request and handle errors. .subscribe() is used similarly to pass a response and error
 */
  constructor(private http: HttpClient,
    private auth: AngularFireAuth,
    private router: Router,) {}

  getCourses(): Observable<Course[]> {//Observable to listen for changes
    console.log(this.http.get<Course[]>("/api/courses/"));
    return this.http.get<Course[]>("/api/courses/");//get request
  }//Gets courses

  createSchedule(name:string): Observable<any> {
    return this.http
    .post<any>("/api/schedules", { name }, httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }//Creates a schedule
  //Adss user to db
  tdUser(uid:string, email:string, dislayname: string): Observable<any>{
    const item={
      uid: uid,
      status: true,
      email: email,
      display: dislayname,
      adminstatus: false,
    }
    return new Observable<any>(observer => {
      this.auth.user.subscribe(user => {
        user && user.getIdToken().then(token => {//Gets id token
          this.http.post<any>(
            "/api/admin/duser/entry",
            item,
            httpOptionsWithAuthToken(token),//Passes the token
            ).subscribe((res) => {observer.next(res)},(error)=>{
              this.handleError(error)
            });
          })
        })
      })
    }
    //Adss user as admin
    addAdminF(uid:string, id:number):Observable<any>{
      console.log(uid)
      return new Observable<any>(observer => {
        let item={
          id:id,
          uid:uid
        }
        this.auth.user.subscribe(user => {
          user && user.getIdToken().then(token => {
            this.http.post<any>(
              `api/admin/duser/entry/ssss`,
              item,
              httpOptionsWithAuthToken(token),
              ).subscribe((res) => {observer.next(res)},(error)=>{
                this.handleError(error)
              });
            })
          })
        })
      }
      //Posts dmca logs to db
      postDMCAlog(item:any):Observable<any>{
        return new Observable<any>(observer => {
          this.auth.user.subscribe(user => {
            user && user.getIdToken().then(token => {
              this.http.post<any>(
                `/api/admin/duser/dmca`,
                item,
                httpOptionsWithAuthToken(token),
                ).subscribe((res) => {observer.next(res)},(error)=>{
                  this.handleError(error)
                });
              })
            })
          })
      }
      activateAccount(uid:string):Observable<any>{//Activates a user account
        let item=[]
        return new Observable<any>(observer => {
          this.auth.user.subscribe(user => {
            user && user.getIdToken().then(token => {
              this.http.post<any>(
                `/api/admin/user/${uid}`,
                item,
                httpOptionsWithAuthToken(token),
                ).subscribe((res) => {observer.next(res)},(error)=>{
                  this.handleError(error)
                });
              })
            })
          })
        }
        deactivateAccount(uid:string):Observable<any>{//Deactivates a user account
          let item=[]
          return new Observable<any>(observer => {
            this.auth.user.subscribe(user => {
              user && user.getIdToken().then(token => {
                this.http.post<any>(
                  `/api/admin/user/${uid}/1`,
                  item,
                  httpOptionsWithAuthToken(token),
                  ).subscribe((res) => {observer.next(res)},(error)=>{
                    this.handleError(error)
                  });
                })
              })
            })
          }
      getAdmin():Observable<UserProfile[]>{//Gets all user list for admin

        return new Observable<UserProfile[]>(observer => {
          this.auth.user.subscribe(user => {
            user && user.getIdToken().then(token => {
              this.http.get<UserProfile[]>(
                `/api/admin/`,

                httpOptionsWithAuthToken(token),
                ).subscribe((res) => {observer.next(res)},(error)=>{
                  this.handleError(error)
                });
              })
            })
          })
        }



  getTimetable(subjC:string, courseC:string): Observable<TimeView[]> {//Gets timetable infor for a course
   return this.http.get<TimeView[]>(`/api/courses/${subjC}/${courseC}`).pipe(
    catchError(this.handleError)
  )

  }
  getTimetable2(subjC:string, courseC:string, component:string): Observable<TimeView[]> {//Gets timetable infor for a course and component

    return this.http.get<TimeView[]>(`/api/courses/${subjC}/${courseC}/${component}`).pipe(
      catchError(this.handleError)
    );
  }
  getSearchedCourse(subjC:string, sid:number): Observable<SearchView[]> {//Gets searched course

    return this.http.get<SearchView[]>(`/api/courses/courselist/${subjC}/${sid}`).pipe(
      catchError(this.handleError)
    );
  }
  getSearchedCourseKeywords(subjC:string, sid:number): Observable<SearchView[]> {//Gets searched course by keywords

    return this.http.get<SearchView[]>(`/api/courses/courselist/${subjC}/${sid}`).pipe(
      catchError(this.handleError)
    );
  }
  getReview(id:number): Observable<Review[]> {//Gets review

    return this.http.get<Review[]>(`/api/reviews/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  getAdminReview(): Observable<ReviewAdm[]>{
    return new Observable<ReviewAdm[]>(observer => {//Gets all reviews for admin
      this.auth.user.subscribe(user => {
        user && user.getIdToken().then(token => {
          if (user && token) {
            this.http.get<ReviewAdm[]>(`/api/reviews/`, httpOptionsWithAuthToken(token))
              .subscribe(listings => {
                observer.next(listings);
              });
          } else {
            observer.next();
          }
        })
      })
    })
  }
  modifyAdminReview(id,par): Observable<ReviewAdm[]>{//Change a review status
   let item={
      id: id,
      par: par
    }

    return new Observable<ReviewAdm[]>(observer => {
      this.auth.user.subscribe(user => {
        user && user.getIdToken().then(token => {
          if (user && token) {
            this.http.post<ReviewAdm[]>(`/api/reviews/`,item, httpOptionsWithAuthToken(token))
              .subscribe(listings => {
                observer.next(listings);
              });
          } else {
            observer.next();
          }
        })
      })
    })
  }
  addReview(id:number,review:string): Observable<Review>{//Allows user to add review

    return new Observable<Review>(observer => {
      this.auth.user.subscribe(user => {
        user && user.getIdToken().then(token => {
          this.http.post<Review>(
            `/api/reviews/${id}`,
            {review},
            httpOptionsWithAuthToken(token),
            ).pipe(catchError(this.handleError)).subscribe(() => observer.next());
          })
        })
      })
    }


  addToSchedule(item: string): Observable<any>{//Creates a schedule
    console.log(item)
    return new Observable<any>(observer => {
      this.auth.user.subscribe(user => {
        user && user.getIdToken().then(token => {
          this.http.post<any>(
            "/api/schedules/courses/",
            item,
            httpOptionsWithAuthToken(token),
            ).subscribe((res) => {observer.next(res)},(error)=>{
              this.handleError(error)
            });
          })
        })
      })
    }
    editSchedule(id,item: string): Observable<any>{//Edits a schedule
      console.log(item)
      return new Observable<any>(observer => {
        this.auth.user.subscribe(user => {
          user && user.getIdToken().then(token => {
            this.http.post<any>(
              `/api/schedules/personal/${id}`,
              item,
              httpOptionsWithAuthToken(token),
              ).subscribe((res) => observer.next(res),(error)=>{
                this.handleError(error)
              });
            })
          })
        })
      }

      getScheduleForUser(): Observable<SchedList[]> {//Gets schedule for a user
        return new Observable<SchedList[]>(observer => {
          this.auth.user.subscribe(user => {
            user && user.getIdToken().then(token => {
              if (user && token) {
                this.http.get<SchedList[]>(`/api/schedules/personal/1/1`, httpOptionsWithAuthToken(token))
                  .subscribe(listings => {
                    observer.next(listings);
                  });
              } else {
                observer.next([]);
              }
            })
          })
        })
      }

  getSchedule(): Observable<SchedList[]> {

    return this.http.get<SchedList[]>("/api/schedules/");//Get schedules
  }
  getScheduleById(id: string): Observable<ScheduleFull>{//Get schedule by id
    return new Observable<ScheduleFull>(observer => {
      this.auth.user.subscribe(user => {
        user && user.getIdToken().then(token => {
          if (user && token) {
            this.http.get<ScheduleFull>(`/api/schedules/personal/${id}`, httpOptionsWithAuthToken(token))
              .subscribe(listings => {
                observer.next(listings);
              });
          } else {
            observer.next();
          }
        })
      })
    })
  }
  getScheduleInfo(subjC:string): Observable<ScheduleView[]> {//Gets schedule info
    return this.http.get<ScheduleView[]>(`/api/schedules/${subjC}`).pipe(
     catchError(this.handleError)
   )

   }
   deleteASchedule(name:string): Observable<any>{//Deletes a schedule
    return new Observable<any>(observer => {
      this.auth.user.subscribe(user => {
        user && user.getIdToken().then(token => {
          this.http.delete<any>(
            `/api/schedules/${name}`,

            httpOptionsWithAuthToken(token)
            ).subscribe((res) => {observer.next(res)},(error)=>{
              this.handleError(error)
            });
          })
        })
      })
    }

   deleteAllSchedule(): Observable<any>{//deletes all schedule. Currently not functional on backend
    return this.http.delete<any>('/api/schedules/schedules/7692')
   }
   getPolicy(): Observable<Policies>{//Gets all policy
     return this.http.get<Policies>('/api/admin/policy/policy')
   }
   modifyPolicy(id:string, policy:string): Observable<any>{//Modifies a policy
    let item={
      id: id,
      policy: policy,
    }
    console.log(item)

    return new Observable<ReviewAdm[]>(observer => {
      this.auth.user.subscribe(user => {
        user && user.getIdToken().then(token => {
          if (user && token) {
            this.http.post<ReviewAdm[]>(`/api/admin/policy/policy`,item, httpOptionsWithAuthToken(token))
              .subscribe(listings => {
                observer.next(listings);
              });
          } else {
            observer.next();
          }
        })
      })
    })

   }


  private handleError(error: HttpErrorResponse) {//Handles all error

      alert(error.error.message)
      return throwError(
      `${error.error.message}`);
  }
}
