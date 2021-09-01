import express from "express";
import fs from "fs";
import path, { format } from "path";
import * as admin from "firebase-admin";
import timeFile from "../Lab3-timetable-data.json";
import { db } from "../database";
import { courseDetails } from "./courseDetails";
const router = express.Router();

/**
 * 
 * This document does not repeat comments for similar operations. It is assumed that the reader is knowledgable enough to identify similar operations
 * 
 */
export const SchedulesRoute = () => {
  router.get("/", async (req, res) => {//This route gets all the schedules that are public
    try {
      const { results } = await db.query(`
      SELECT schedules.*, count(schedulevalues.schedulevalueid) as number_of_courses        
      from schedules
      left join schedulevalues
      on (schedules.id = schedulevalues.scheduleid)
      WHERE schedules.type=true
      
      group by
          schedules.id
          order by datemodified DESC;    
      `,
          
          );//db query

      if (results.length !== 0){

        
        let arr = [];

          results.map((a) => {
            let ty = a.type === 0 ? "private" : "public";
            let item = {
              scheduleid: a.id,
              schedulename: `${a.name}`,
              numberC: a.number_of_courses,
              dateV: `${a.datemodified}`,
              status: `${ty}`,
              creatorname: `${a.creatorname}`,
              description: a.description
            };
            arr.push(item);
          });
          console.log(arr);
          res.status(200).json(arr);//sends response
      }
      else res.status(404).send({ message: "No Schedule Found" });
    } catch (err) {
      console.log(err)
      res.status(500).send({ message: "Error connecting to db", err });//sends error
    }
  });
  router.get("/personal/:id/:course?", async (req, res) => {//This route gets all the schedules for a user
    const id = req.params.id;
    const comp = req.params.course;
    const token = req.headers.authtoken;//gets the token
    try {
      const user = await admin.auth().verifyIdToken(token);//verifies that the user exists

      if (user) {
        const userid = user.user_id;

        if (!comp) {
          const { results } = await db.query(
            `
      SELECT name, type, description FROM schedules WHERE id=?;
      `,
            [id]
          );

          
          const sqlval = await db.query(
            `
      SELECT * FROM schedulevalues WHERE scheduleid=? ;
      `,
            [id]
          );
          //console.log(sqlval.results[0])
          let arr = [];
          sqlval.results.forEach((element) => {
            arr.push(element);
          });
          let ty = results[0].type === 0 ? "private" : "public";
          let item = {//creates the object
            schedulename: `${results[0].name}`,
            backname: `${results[0].name}`,

            status: `${ty}`,
            description: `${results[0].description}`,
            courseArray: arr,
          };
          console.log(item);
          res.status(200).json(item);
        } else {
          const { results } = await db.query(
            `
      SELECT schedules.*, count(schedulevalues.schedulevalueid) as number_of_courses        
      from schedules
      left join schedulevalues
      on (schedules.id = schedulevalues.scheduleid)
      WHERE schedules.userid=?
      
      group by
          schedules.id
          order by datemodified DESC;    
      `,
            [userid]
          );//Selects schedule and counts number of courses for it

          //console.log(results)
          let arr = [];

          results.map((a) => {
            let ty = a.type === 0 ? "private" : "public";
            let item = {//creates the object 
              scheduleid: a.id,
              schedulename: `${a.name}`,
              numberC: a.number_of_courses,
              dateV: `${a.datemodified}`,
              status: `${ty}`,
              creatorname: `${a.creatorname}`,
            };
            arr.push(item);
          });
          console.log(arr);
          res.status(200).json(arr);//sends the response
        }
      } else {
        console.log("not logged in");
        res.status(500);
      }
    } catch (error) {
      if(error.code==='auth/argument-error'){//FirebaseAuthError: First argument to verifyIdToken() must be a Firebase ID token string.
        console.log(error);
        res.status(500).send({ message: "Unauthorized request", error });
        }
        else{
      res.status(500).json(error);//sends error
      console.log(error)
        }
    }
  });
  router.post("/personal/:id", async (req, res) => {//This route allows a user to update a schedule
    const courseid = req.params.id;
    const BreakException = {};
    
    try {
      const token = req.headers.authtoken;
      const user = await admin.auth().verifyIdToken(token);//verifies the user with token
    if (user) {
      const creatorname = user.name;
      const userid = user.user_id;
      // console.log(req.body)
      let visibility = req.body[0].status;
      let description = req.body[0].description;

      // console.log(visibility)
      const { review = "" } = req.body;

      let x = req.body.find((ob) => {
        return ob.name;
      });
     
     
        const sqlVal = await db.query(
          `
    SELECT subjectcode as subjectCode, CONCAT(coursecode,suffix) as courseCode FROM course ;
  `,
          [name]
        );//selects all the courses in db
        let body = req.body;
        let y = [];
        sqlVal.results.forEach((element) => {
          let temp = {
            subjectCode: element.subjectCode,
            courseCode: element.courseCode,
          };
          y.push(temp);
        });
        body = body.map(({ subjectCode, courseCode }) => ({
          subjectCode,
          courseCode,
        }));
        body.forEach((a) => {
          // console.log(a)
          if (
            !y.some(
              (e) =>
                e.subjectCode === a.subjectCode && e.courseCode === a.courseCode
            )
          ) {
            throw BreakException;//if a course in the user made schedule does not exist it returns an error
          }
        });

        const name = x.name;
        await db.query(
          `
      UPDATE schedules SET name=?, type=?, description=? ,datemodified=NOW() WHERE id=? AND userid=?
    `,
          [name, visibility, description, courseid, userid]
        );//updates the schedule details

        const values = [];
        const cvalues = [];
        const idvalues = [];
        const { results } = await db.query(
          `
    SELECT schedulevalueid FROM schedulevalues WHERE scheduleid=?;
  `,
          [courseid]
        );//gets the id for the schedulevalue pair

        let result = results.map((a) => a.schedulevalueid);

        body.forEach((a, index) => {
          let obj = {
            id: result[index],
            subj: a.subjectCode,
            course: a.courseCode,
            coursei: courseid,
            userid: userid,
          };
          values.push(Object.values(obj));
        });

        console.log(result);

        await db.query(
          `INSERT INTO schedulevalues (schedulevalueid, subjectCode, courseCode, scheduleid, scheduleuserid)
    VALUES ?
    ON DUPLICATE KEY UPDATE
    subjectCode=VALUES(subjectCode), courseCode=VALUES(courseCode)`,
          [values]
        );//updates the db with the changes
        res.status(200).json({message:'Done'});
       
    } else {
      res.status(500).send({ message: "User is not valid" });
      console.log("invalid user");
    }}
    catch (error) {
      if (error == BreakException)
        res.status(500).send({ message: "Course does not exist", error });
      else if(error.code==='auth/argument-error'){//FirebaseAuthError: First argument to verifyIdToken() must be a Firebase ID token string.
          console.log(error);
          res.status(500).send({ message: "Unauthorized request", error });
          }
      else res.status(500).send({ message: "The schedule exists", error });
      
      console.log(error);
    }
  });

  router.get("/:id", async (req, res) => {//Lab3. Gets course details for a schedule
    let name = req.params.id;
    try {
      const { results } = await db.query(
        `
      SELECT 
      schedulevalues.id, schedulevalues.subjectCode, schedulevalues.courseCode
    FROM 
        schedules
    INNER JOIN 
        schedulevalues 
    ON
        schedules.id=schedulevalues.id
    WHERE 
       BINARY schedules.name=?
    
 `,
        [name]
      );

      if (results.length !== 0) res.status(200).send(results);
      else
        res
          .status(404)
          .send({ message: "There are no courses stored under this schedule" });
    } catch (err) {
      res.status(500).send({ message: "Error connecting to db", err });
    }
  });

  
  router.delete("/:id", async (req, res) => {//Allows a user to delete a schedule
    try {
      const token = req.headers.authtoken;
      const user = await admin.auth().verifyIdToken(token);
      const names = req.params.id;
      
      const userid=user.user_id
      await db.query(
        `DELETE FROM schedulevalues WHERE scheduleid=? AND scheduleuserid=?; 
    `,
        [names,userid]
      );//Deletes the values from the table
      await db.query(`DELETE FROM schedules WHERE id=? AND userid=?;`, [names,userid]);//Deletes the schedule

      console.log("Hello");
      res.status(200).send({ message: `Successfully deleted` });
    } catch (err) {
      if(err.code==='auth/argument-error'){//FirebaseAuthError: First argument to verifyIdToken() must be a Firebase ID token string.
      console.log(err);
      res.status(500).send({ message: "Unauthorized request", err });
      }
      else{
      console.log(err);
      res.status(500).send({ message: "The schedule does not exist", err });
    }
  }
  });

  router.delete("/schedules/:deleteID", async (req, res) => {//Lab3. Allows deleting of all courses. This function does not work anymore
    try {
      const delSafe = req.params.deleteID;
      if (delSafe === "7692") {
        await db.query(`DELETE FROM schedulevalues;`);
        await db.query(`
              DELETE FROM schedules;`);//Deletes all schedules

        res.status(200).send({ message: `Successfully deleted all schedules` });
      } else {
        res.status(200).send({ message: `Unauthorized request` });
      }
    } catch (err) {
      console.log(err);
      if (err.code === "ER_TABLEACCESS_DENIED_ERROR")
        res.status(500).send({ message: "Unauthorized Request" });
      else res.status(500).send({ message: "The schedule does not exist" });
    }
  });

  router.use("/courses", courseDetails());

  return router;
};
