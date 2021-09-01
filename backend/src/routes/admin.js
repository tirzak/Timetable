import express from "express";
import timeFile from "../Lab3-timetable-data.json";
import { db } from "../database";
import stringSimilarity from "string-similarity";
const router = express.Router();

import * as admin from 'firebase-admin';
/**
 * 
 * This document does not repeat comments for similar operations. It is assumed that the reader is knowledgable enough to identify similar operations
 * 
 */

//This file handles all requests related to admin


export const AdminRoute = () => {
  try{
  router.get("/:id?", async (req, res) => { //This route is for getting the userlist

    const idToken = req.headers.authtoken;//Gets the token from header
    const id =req.params.id
    let bool
    const user =await admin
    .auth()
    .verifyIdToken(idToken)
    .then((claims) => {
      if (claims.admin === true) {//Verifies that the user is an admin
          console.log('admin')
          bool=true
      }});

        try{
            if(bool){
            if(!id){
        const results = await db.query(`
            SELECT * FROM admintable 
        `);  //Gets user list
        
        let arr=[]
            results.results.map((a)=>{
                let stat = a.status===0 ? 'disabled' :'active'
                let adminstat= a.adminstatus===0 ? 'disabled' :'active' 
                let y={
                    userid: a.userid,
                    status: stat,
                    email: a.email,
                    displayname: a.displayname,
                    adminstatus: adminstat
                }
                arr.push(y)
            }

            )
            res.status(200).json(arr) //sends the response
            }
            else{   
    

            }

        
      }
      else{
        res.status(500).send({message: 'Logged In'})
      }
        }
    catch(error){
        console.log(error)
        res.status(500).send({message: 'Logged In'},error)  //Sends error
    }
    

      
  });
  router.post("/duser/entry", async (req, res) => { //Enters an user into the database
    const courseid = req.params.id
    const token = req.headers.authtoken;
    let BreakExcept ={}
    console.log(req.body)
    const items = Object.values(req.body)//Extracts values
    console.log(items)
    const user = await admin.auth().verifyIdToken(token) //verifies that its a registered user

        try{
            if(user){
                         
            await db.query(`
            INSERT INTO admintable (userid, status, email, displayname, adminstatus) 
            VALUES (?,?,?,?,?)
            `,[items[0],items[1],items[2],items[3],items[4],])
            res.status(200).json({message: 'Done'})
            }

        }catch(error){
            if(error.code=='ER_DUP_ENTRY') //If a user already exists it returns an error
       {     res.status(200).json({message: 'Done'}) 
            console.log('Err')}
            else{
            console.log(error)
            res.status(500).json(error)
            }
        }



  })
  router.post("/user/:id/:bid?", async(req, res) => {//This route handles deactivation/activation of an account
    const token= req.headers.authtoken
    const id = req.params.id
    const bid =req.params.bid
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
            if(bid){
         await db.query(`
            UPDATE admintable SET status=false WHERE userid=? 
        `,[id])

         admin.auth().updateUser(id, {
            disabled: true //Deactivates account
        });
            }
        else{
            await db.query(`
            UPDATE admintable SET status=true WHERE userid=?
        `,[id])
        await admin.auth().updateUser(id, {
            disabled: false //Activates a disabled account
        });

        }
        res.status(200).json({message: 'Done'})
      }
    }
    
    catch(error){
        console.log(error)
        res.status(500).send({message: 'Not a admin'})
    }
  
        }

  )

  router.get("/policy/policy", async(req, res) => { //This route gets the policies of the website
   
   
        try{  

          const {results}= await db.query(`
          SELECT * FROM aup`)
            
        res.status(200).json(results)
      
    }
    
    catch(error){
        console.log(error)
        res.status(500).send({message: 'Not a admin'})
    }
  
        }

  )
  router.post("/policy/policy", async(req, res) => {//This route handles all the changes to the policies
    const token= req.headers.authtoken
    const id = req.body.id
    const policy= req.body.policy
    
    console.log('11')
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
            if(id==='1'){
         await db.query(`
            UPDATE aup SET aup=? WHERE idAUP=1
        `,[policy])

          }
        else if (id==='2'){
          await db.query(`
          UPDATE aup SET privacy=? WHERE idAUP=1
      `,[policy])

        }    
        else{
          await db.query(`
          UPDATE aup SET dmca=? WHERE idAUP=1
      `,[policy])
        }
        res.status(200).json({message: 'Done'})
      }
    }
    
    catch(error){
        console.log(error)
        res.status(500).send({message: 'Not a admin'})
    }
  
        }

  )
  

  router.post("/duser/entry/ssss", async(req, res) => {//This route handles activation and deactivation of an admin
    const token= req.headers.authtoken
    const uid = req.body.uid
    const id = req.body.id
    console.log(uid)
   
    let bool
   
        try{
            await admin
            .auth()
            .verifyIdToken(token)
            .then((claims) => {
              if (claims.admin === true) {
                console.log('admisdasdasd')
                bool=true
            }});
            if(bool){
            if(id===1){
         await db.query(`
            UPDATE admintable SET adminstatus=true WHERE userid=?
        `,[uid])
       await admin.auth().setCustomUserClaims(uid, {admin:true})//Sets the user as an admin
        .then(()=>{
            console.log('custom claims set', uid)
            res.status(200).json({message: 'Done'})
        },(err)=>{
          console.log(err)
        }) 

          }
       
        else{
          await admin.auth().setCustomUserClaims(uid, {admin:false})//Removes the user's admin privileges
          .then(()=>{
              console.log('custom claims set', uid)
              
          }) 
          await db.query(`
          UPDATE admintable SET adminstatus=false WHERE userid=?
      `,[uid])
      res.status(200).json({message: 'Done'})
        }
        
      }
    }
    
    catch(error){
        console.log(error)
        res.status(500).send({message: 'Not a admin'})
    }
  
        }

  )
  router.post("/duser/dmca", async(req, res) => {//This route handles all kind of DMCA logging
    const token= req.headers.authtoken
    const userid = req.body.userid
    const reviewid = req.body.reviewid
    const date = req.body.date
    const type = req.body.type

    
   
    let bool
   
        try{
            await admin
            .auth()
            .verifyIdToken(token)
            .then((claims) => {
              if (claims.admin === true) {
                console.log('admisdasdasd')
                bool=true
            }});
            if(bool){
            
         await db.query(`
            INSERT into dmcatable (userid,reviewid,date,type) VALUES (?,?,?,?)
        `,[userid,reviewid,date,type])
     

          
       
          res.status(200).json({message: 'Done'})
      }
    }
    
    catch(error){
        console.log(error)
        res.status(500).send({message: 'Check Review ID'})
    }
  
        }

  )
      }
      catch(error){
        console.log(error)
      }
  
  return router;//returns the router

}