import express from 'express'
import verify from '../middleware/verify.js'
import { addDetailController, getDetailController } from '../controller/DetailController.js'

const addDetail=express.Router()
addDetail.post('/add-detail',verify,addDetailController)

const getDetail=express.Router()
getDetail.post('/get-detail/:id',verify,getDetailController)

export {addDetail,getDetail}