import express from 'express'
import verify from '../middleware/verify.js'
import { getAllUserController } from '../controller/followController.js'
const getAllUser=express.Router()
getAllUser.get('/get-all-user',verify,getAllUserController)

export {getAllUser}