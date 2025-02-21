import express from 'express';
import verify from '../middleware/verify.js'
import { addActivityController, addtTwitterActivityController } from '../controller/activityController.js';
const addActivity=express.Router();
addActivity.post('/add-activity',verify,addActivityController)

const getActivity=express.Router();
getActivity.get('/get-twitee-activity/:twiteeid',verify)

const getUserActivity=express.Router();
getUserActivity.get('/get-user-activity/:userid',verify)

const updateActivity=express.Router();
updateActivity.put('/update-activity',verify)

const twitteeActivity=express.Router();
twitteeActivity.post('/add-twitte-activity',verify,addtTwitterActivityController)

export {addActivity,twitteeActivity}