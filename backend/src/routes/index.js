import {getCoursesRoute} from './getCourses'
import { SchedulesRoute} from './schedules'
import { getReviewsRoute} from './getReview'
import { AdminRoute} from './admin'
import express from 'express';
const router = express.Router()

/**
 * 
 * This document does not repeat comments for similar operations. It is assumed that the reader is knowledgable enough to identify similar operations
 * 
 */
export default () =>{
router.get('/',(req, res)=>{
    res.send('Hello from index')
})    


/**
 * 
 * The code below keeps the code clean by using different files for different routes
 * 
 */
router.use('/courses',getCoursesRoute());
router.use('/schedules', SchedulesRoute())
router.use('/reviews', getReviewsRoute())
router.use('/admin',AdminRoute())
return router;

}