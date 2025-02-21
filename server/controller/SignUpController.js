import decryptData from "../helper/decryptData.js"
import encryptData from "../helper/encryptData.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../config/dbConfig.js'
async function signInController(req,res) {
    const data=decryptData(req.body.encryptedData)
    const {email,password}=data
    try {
        const [findUser]=await db.query('SELECT * FROM SIGNUP WHERE email=?',[email])
        if(findUser.length>0){
            const isValid=await bcrypt.compare(password,findUser[0].password)
            if(isValid){
                const id=findUser[0].id
                const isDetail=await db.query('SELECT * FROM PDETAIL WHERE userid=?',[id])
                console.log(isDetail[0].length>0)
                if(isDetail[0].length>0){
                    const token=await jwt.sign({user:findUser},process.env.SECRET_KEY,{expiresIn:'1h'})
                    const encryptedData=await encryptData({message:"login success",isDetail:true,user:isDetail[0],userid:findUser[0].id,token,success:true})
                    return res.status(200).json({data:encryptedData})
                }
                else{

                    const token=await jwt.sign({user:findUser},process.env.SECRET_KEY,{expiresIn:'1h'})
                    const encryptedData=await encryptData({message:"login success",idDetail:false,userid:findUser[0].id,token,success:true})
                    return res.status(200).json({data:encryptedData})
                }
            }
        }
        const encryptedData=await encryptData({message:"account dont exist",success:false})
        return res.status(500).json({data:encryptedData})
    } catch (error) {
        console.log(error)
        const encryptedData= encryptData(error)
        return res.status(500).json({data:encryptedData})
    }
}


async function signUpController(req,res) {
    const data=decryptData(req.body.encryptedData)
    console.log("data",data)
    const {email,password,dob}=data
    try {
        const [findUser]=await db.query('SELECT * FROM SIGNUP WHERE email=?',[email])
        if(findUser.length>0){
            const encryptedData=await encryptData({message:"user already exist",success:false})
            return res.status(500).json({data:encryptedData})
        }
        const hashpassword=await bcrypt.hash(password,10)
        const [newUser]=await db.query('INSERT INTO SIGNUP (email,password,dob) VALUES (?,?,?)',[email,hashpassword,dob])
        if(newUser.affectedRows>0){
            const encryptedData=await encryptData({message:"user created",success:true})
            return res.status(200).json({data:encryptedData})
        }
        const encryptedData=await encryptData({message:"internal server error",success:false})
        return res.status(500).json({data:encryptedData})
    } catch (error) {
        console.log(error)
        const encryptedData= encryptData({message:error,success:false})
        return res.status(500).json({data:encryptedData})
    }
}

export {signInController,signUpController}