import express from 'express';
import { createTwitteController, deleteTwitteController, getAllTwitteController, getTwitteController, updateTwitteController } from '../controller/TwitteController.js';
import verify from '../middleware/verify.js';
import { upload } from '../middleware/upload.js';

const createTwitte=express.Router()
createTwitte.post('/create-twitte',verify,upload,createTwitteController)

const getTwitte=express.Router();
getTwitte.get('/get-twitte/:userid',verify,getTwitteController)

const updateTwitte=express.Router();
updateTwitte.put('/update-twitte',verify,upload,updateTwitteController)

const deleteTwitte=express.Router()
deleteTwitte.delete('/delete-twitte/:twitteid',verify,deleteTwitteController)

const getAllTwitte=express.Router()
getAllTwitte.get('/get-all-twitte',verify,getAllTwitteController)

export {createTwitte,getTwitte,updateTwitte,deleteTwitte,getAllTwitte}