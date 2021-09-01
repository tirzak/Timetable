import e from 'express';
import express from 'express';
import * as admin from 'firebase-admin';

import { db } from '../database';
const router = express.Router()

/**
 * 
 * This document does not repeat comments for similar operations. It is assumed that the reader is knowledgable enough to identify similar operations
 * 
 */

export const courseDetails =  () =>{

  router.get('/:id', async (req,res)=>{// Lab3. Gets courses for a schedules
   
    
    try{ 
      const id =req.params.id  
      const {results}=await db.query(`
       SELECT * FROM schedulevalues WHERE id=?;`,[id] 
    
 );
      

    res.status(200).json(results)//sends the result
    
  }
  catch (err){
    res.status(500).json({message: 'Error connecting to db', err})//sends error
  }
  })
 
 router.post('/',async(req,res)=>{//Creates a new list with courses
  const courseid = req.params.id
  const BreakException = {};
  const MaxException = {};
  try{
  const token = req.headers.authtoken;
  const user = await admin.auth().verifyIdToken(token);//Verifies the token
  
  
  if(user){ //If user exists
      
      const creatorname = user.name;
      const userid = user.user_id
     // console.log(req.body)
      let visibility= req.body[0].status
      let description= req.body[0].description
      
     // console.log(visibility)
      const { review = ''} = req.body;

  let x=req.body.find((ob)=>{
    return ob.name
  })
  
 
    const sqlVal = await db.query(`
  SELECT subjectcode as subjectCode, CONCAT(coursecode,suffix) as courseCode FROM course ;
`,[name]);//Selects  from course list to verify that a course exists
    let body=(req.body) 
    let y = [];
    sqlVal.results.forEach((element) => {
      let temp={
        subjectCode: element.subjectCode,
        courseCode: element.courseCode
      }
      y.push(temp);
    });
    body=body.map(({subjectCode, courseCode})=>({subjectCode,courseCode}))
    body.forEach((a)=>{
      // console.log(a)
       if (!(y.some(e => e.subjectCode === a.subjectCode && e.courseCode=== a.courseCode))) {
         throw BreakException;//If a course does not exist, it sends an error
       }
      })
      const maxCheck= await db.query(`
      SELECT COUNT(id) as listNum FROM schedules WHERE userid=?
      `,[userid]) 
      console.log(maxCheck.results.listNum)
     if(maxCheck.results.listNum=='20'){//Checks that the number of schedules is less than 20 for the user
       throw MaxException;
     } 
    const name =x.name
  await db.query(`
    INSERT INTO schedules (name,userid,creatorname,type,description) 
    VALUES (?,?,?,?,?);
  `,[name,userid,creatorname,visibility,description]);
  const {results}= await db.query(`
  SELECT id,userid FROM schedules WHERE name=?;
`,[name]); //inserts the schedule details into the table

 
  
  
  const values=[]
  
  
  
 // console.log(y)    

   body.forEach((a)=>{
   // console.log(a)
  
    const obj = {'id':results[0].id,'userid':results[0].userid, ...a};
    
    values.push(Object.values(obj))
})
  
 
  
await db.query(
  `INSERT INTO schedulevalues (scheduleid, scheduleuserid, subjectCode, courseCode) VALUES ?`,[values]
);//Inserts the courses for the schedules
 res.status(200).json({message:'Done'});
}

 
 else{
  res.status(500).send({message: 'User is not valid'})
  console.log('invalid user')
 }}
 catch(error){
  if (error == BreakException) res.status(500).send({message: 'Course does not exist', error})
  else if(error == MaxException) res.status(500).send({message: 'You can only create 20 courses', error})
  else res.status(500).send({message: 'The schedule already exists', error})
  console.log(error)
}
}
 ) 
router.post('/:id', async(req,res)=>{//Lab3. Handles adding new courses to schedules
  
try{ 
    let x=req.body.find((ob)=>{
      return ob.name
    })
    const name =x.name
    
  
  
  
    const {results}=await db.query(
    
        `SELECT id, userid FROM schedules WHERE name = ? `,[name]
  
   );
  let body=(req.body) 
  console.log(body)
  body=body.map(({subjectCode, courseCode})=>({subjectCode,courseCode}))
  
  console.log(body)
  const values=[]
   body.forEach((a)=>{
    
    const obj = {'id':results[0].id, ...a};
    
    values.push(Object.values(obj))
})

  await db.query(`DELETE FROM schedulevalues WHERE id= ? `,[results[0].id])
   await db.query(
     `INSERT INTO schedulevalues (id,subjectCode, courseCode) VALUES ?`,[values]
 );
    res.status(200).send({message: `Added to ${name}`})
    
  }
  catch (err){
    res.status(500).json({message: 'The schedule does not exist', err})
  }
  

})

  
        

return router;


}