import express from 'express'
import verify from '../middleware/verify.js'
import { addDetailController, getDetailController } from '../controller/DetailController.js'
import { upload } from '../middleware/upload.js'

const addDetail=express.Router()
addDetail.post('/add-detail',upload,addDetailController)

const getDetail=express.Router()
getDetail.post('/get-detail/:id',verify,getDetailController)

export {addDetail,getDetail}