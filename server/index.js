import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connection from './config/dbConfig.js'
import { signin, signup } from './routes/SingUp.js'
import { createTwitte, deleteTwitte, getAllTwitte, getTwitte, updateTwitte } from './routes/Twitte.js'
import { addDetail, getDetail } from './routes/PDetail.js'
import { addActivity, twitteeActivity } from './routes/activity.js'
import { getAllUser } from './routes/follow.js'

dotenv.config()
const app=express()
app.use(express.json())
app.use(cors())
await connection

//      Login And SignUp
app.use('/',signin)
app.use('/',signup)

app.use('/',getAllUser)

//      Personal Detail
app.use('/',addDetail);
app.use('/',getDetail);

//      Twitte Activity
app.use('/',addActivity)
app.use('/',twitteeActivity)


//      CRUD On Twitte 
app.use('/',createTwitte)
app.use('/',getTwitte)
app.use('/',updateTwitte)
app.use('/',deleteTwitte)
app.use('/',getAllTwitte)

app.listen(process.env.PORT,()=>{
    console.log('start')
})