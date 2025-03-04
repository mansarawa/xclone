import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connection from './config/dbConfig.js'
import { signin, signup } from './routes/SingUp.js'
import { createTwitte, deleteTwitte, getAllTwitte, getTwitte, updateTwitte } from './routes/Twitte.js'
import { addDetail, getDetail } from './routes/PDetail.js'
import { addActivity, twitteeActivity } from './routes/activity.js'
import { getAllUser } from './routes/follow.js'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config()
const app=express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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