import express from 'express'
import verify from '../middleware/verify.js'
import { addDetailController, editDetailController, getDetailController } from '../controller/DetailController.js'
import { upload } from '../middleware/upload.js'

const addDetail=express.Router()
addDetail.post('/add-detail',upload,addDetailController)

const getDetail=express.Router()
getDetail.post('/get-detail/:id',verify,getDetailController)

const editDetail=express.Router()
editDetail.put('/edit-detail',upload,verify,editDetailController)

export {addDetail,getDetail,editDetail}