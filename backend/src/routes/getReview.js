import express from 'express';
import * as admin from 'firebase-admin';
import timeFile from '../Lab3-timetable-data.json'
import { db } from '../database';
import {courseDetails} from './courseDetails'
import { v4 as uuid } from 'uuid';
const router = express.Router()

/**
 * 
 * This document does not repeat comments for similar operations. It is assumed that the reader is knowledgable enough to identify similar operations
 * 
 */
const getDate=()=>{//Gets date
    let dObj = new Date();
  
   let date = ("0" + dObj.getDate()).slice(-2);
  let month = ("0" + (dObj.getMonth() + 1)).slice(-2);
  let year = dObj.getFullYear();
  let hours = dObj.getHours();
  let minutes = dObj.getMinutes();
  return month + "-" + date + "-" + year + " " + hours + ":" + minutes
  }
const dbqer= async(sql,id)=>{
   const {results}= await db.query(`
                SELECT * FROM coursereview WHERE courseid=?`,[id])

  return results              
}  

export const getReviewsRoute =  () =>{

  router.get('/:id', async (req,res)=>{//Gets review for a course
    const id = req.params.id
    try{ 
        const {results}=await db.query(`
        SELECT * FROM coursereview WHERE courseid=? AND reviewstatus=true
        
      
   `,[id]);
        res.status(200).json(results)
    }
    catch (error){
       res.status(500).json(error)

    }

  })
  
  router.get('/', async (req,res)=>{//This route allows an admin to get all reviews posted on the site
    const token= req.headers.authtoken
   
    let bool
   
        try{
            await admin
            .auth()
            .verifyIdToken(token)
            .then((claims) => {
              if (claims.admin === true) {//Verifies that the user is an admin
        
                bool=true
            }});
            if(bool){
            let x
            const {results}=await db.query(`
            SELECT coursereview.*, course.subjectcode,CONCAT(course.coursecode, course.suffix) as coursecode
            FROM coursereview
            JOIN course ON coursereview.courseid=course.courseid`)
            // console.log(results)
            let arr=[]
            results.forEach ((a,index)=>
              {  
            let stat = a.reviewstatus===0 ? false : true

                x = {
                    courseid: a.courseid,
                    subjectcode: a.subjectcode,
                    coursecode: a.coursecode,
                    reviewid: a.reviewid
                    ,reviewstatus: stat,
                    review: a.review,
                    reviewer: a.reviewer,
                    stamp: a.stamp,
                    userid: a.userid,
                    
                }
                
                arr.push(x)
            }
            
           
            )

            console.log('Hellosssss')
            

            res.status(200).json(arr)    
  }

}
  catch(error){
      res.status(500).send({message: error})//Sends error
      console.log(error)
  }

})
router.post('/', async (req,res)=>{//This route allows an admin to change the visibility of a review
    const token= req.headers.authtoken
    console.log(req.body)
    const par = req.body.par
    const id = req.body.id
    console.log(par)
    let bool
   
        try{
            await admin
            .auth()
            .verifyIdToken(token)
            .then((claims) => {
              if (claims.admin === true) {
        
                bool=true
            }});
            if(bool){
                if(par===1){
                    await db.query(`
                    UPDATE coursereview SET reviewstatus = false where reviewid=?
                    `,[id])
                }
                else{
                    await db.query(`
                    UPDATE coursereview SET reviewstatus = true where reviewid=?
                    `,[id])
                }
            

            res.status(200).json({message:'Done'})    
  }

}
  catch(error){
      res.status(500).send({message: error})
      console.log(error)
  }

})
  router.post('/:id', async(req,res)=>{ //This route allows a user to post a review for a course
        const courseid = req.params.id
        const token = req.headers.authtoken;
        const user = await admin.auth().verifyIdToken(token);//Verifies that the user exists
        
        
        if(user){
            const reviewid = uuid()
            const reviewer = user.name;
            const userid = user.user_id
            const reviewstatus= true;
            const { review = ''} = req.body;//Gets the review from body
            const stamp = getDate()
            
            try{
                await db.query(`
                INSERT INTO coursereview (reviewid, review,courseid,reviewstatus,reviewer,stamp,userid) 
                VALUES (?,?,?,?,?,?,?);
                `,[reviewid, review, courseid, reviewstatus, reviewer, stamp, userid]);

               let item = {
                    reviewid: reviewid,
                    review: review,
                    reviewer: reviewer,
                    reviewstatus: reviewstatus,
                    stamp: stamp,
                    userid: userid

                }
                
                res.status(200).json(item)}

            
            catch(error){
                console.log(error)
                res.status(500).json(error)
                
            }
        }
        else{
            console.log('User not verified')
        }
        
  })


  return router;

}