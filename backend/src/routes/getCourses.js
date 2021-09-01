import express from "express";
import timeFile from "../Lab3-timetable-data.json";
import { db } from "../database";
import stringSimilarity from "string-similarity";


/**
 * 
 * This document does not repeat comments for similar operations. It is assumed that the reader is knowledgable enough to identify similar operations
 * 
 */
const router = express.Router();

const getFirstUserData = () => {
  let x = timeFile.map(({ subject, className }) => ({ subject, className }));//Gets the subject details from the file

  return x;
};
const getTimeTable = (value, id, catalog, comp) => {
  let x = [];

  x = timeFile
    .filter((element) => {
      return id === element.subject && catalog === element.catalog_nbr;//Gets timetable data for a course
    })
    .map((ele) => ele.course_info);

  if (comp && x.length !== 0) {
    let y = x[0].filter((element) => comp === element.ssr_component);//Gets timetable for a component for a course
    x = [];
    x.push(y);
  }

  return x;
};

export const getCoursesRoute = () => {
  router.get("/", (req, res) => { //This route gets all the courses in the app
    const obj = getFirstUserData();
    res.send(obj);
  });
  router.get("/:id", (req, res) => {//This route gets all catalog_nbr for a course
    const id = req.params.id;
    let x = timeFile
      .filter((element) => id === element.subject)
      .map((ele) => ele.catalog_nbr);
    if (x.length === 0) res.status(500).send({ message: "Subject not found" });
    else res.send(x);
  });
  router.get("/courselist/:id/:sid", async (req, res) => {//This route handles all search functionality of the app
    const id = req.params.id.toString();
    const sid = req.params.sid;
    let results;
    try {
      /**
       * The code below selects result based on different type of search mechanisms
       */
      if (sid == '1') { 
        results = await db.query(`
    SELECT courseid, CONCAT(subjectcode,coursecode,suffix) as value FROM course order by courseid`);
      } else if (sid=='2') {
        results = await db.query(`
    SELECT courseid, CONCAT(coursecode,suffix) as value FROM course order by courseid`);
      }
      else{
        results =await db.query(`
    SELECT courseid, CONCAT(coursecode,suffix,classnamewsp) as value FROM course order by courseid`);//Keyword search
     
      }
      let y = [];
      results.results.forEach((element) => {
        y.push(element.value);
      });

      const value = stringSimilarity.findBestMatch(id, y);//Uses Dice's coefficient to find best match
      let indexStore = [];
      let q;

      q = Object.values(value);//extract values
      

      let x = q[0].find((a) => a.rating === 1);

    if(sid !=='3'){    if (x !== undefined && sid !== "2") {
        q[0].find((a, index) => {
          if (a.rating == 1) { // if full match exists, returns it
            indexStore.push(index + 1);
            return a;
          }
        });
      } else {
        q = q[0].filter((a, index) => {
          if (a.rating >= 0.78) { //Checks if a lower match exists
            indexStore.push(index + 1);
            return a;
          }
        });
      }}
      else{
        let x
        x= q[0].filter((a, index) => {
          if (a.rating >= 0.4) {
            indexStore.push(index + 1);
            return a;
          }
        });
        if(indexStore.length===0){
          x = q[0].filter((a, index) => {
            if (a.rating >= 0.2) {
              indexStore.push(index + 1);
              return a;
            }
          });
        }
        if(indexStore.length===0){
          x= q[0].filter((a, index) => {
            if (a.rating >= 0.1) {
              indexStore.push(index + 1);
              return a;
            }
          });
        }
        q=x
        
      }

      //Selects everything from course table
      console.log(indexStore);
      let values = await db.query(
        `
    SELECT * FROM course where courseid in (?)`, //Grabs the course details
        [indexStore]
      );
      let timeStorage = [];

      values.results.forEach((a) => {
        let sub = a.subjectcode;
        let course = a.coursecode + a.suffix;

        let obj = {
          id: a.courseid,
          subjectcode: sub,
          coursecode: course,
          classname: a.classname,
          information: getTimeTable(2, sub, course)[0],
        };
        timeStorage.push(obj);
      });

      res.status(200).json(timeStorage);//sends the result back
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error connectito db", err });
    }
  });

  router.get("/:id/:subj/:course?", (req, res) => {//Lab3. Gets timetable for a course
    const id = req.params.id;
    const catalog = req.params.subj;
    const comp = req.params.course;
    const x = getTimeTable(1, id, catalog, comp);

    if (x.length === 0 || x[0] == "")
      res.status(404).send({ message: "Not found" });
    else {
      res.status(200).send(x[0]);
    }
  });

  return router;
};
