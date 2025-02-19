import db from '../config/dbConfig.js'
import decryptData from '../helper/decryptData.js'
import encryptData from '../helper/encryptData.js'
async function createTwitteController(req,res) {
    const data=decryptData(req.body.encryptedData)
    console.log(data)
    const {text,image,userId}=data
    try {
        const [findUser]=await db.query('SELECT * FROM SIGNUP WHERE id=?',[userId])
        if(findUser.length>0){
            const [newTwitte]=await db.query('INSERT INTO TWITTES (text,image,userId) VALUES (?,?,?)',[text,image,userId])
            if(newTwitte.affectedRows>0){
                const encryptedData=await encryptData({message:"twitte created",success:true})
                return res.status(200).json({data:encryptedData})
            }
            const encryptedData=await encryptData({message:"internal server error",success:false})
            return res.status(500).json({data:encryptedData})
        }
        const encryptedData=await encryptData({message:"user not exist",success:false})
        return res.status(500).json({data:encryptedData})
     
    } catch (error) {
        console.log(error)
        const encryptedData= encryptData({message:error,success:false})
        return res.status(500).json({data:encryptedData})
    }
}


async function getTwitteController(req,res) {
    const userId=req.params()
    try {
        const [findUser]=await db.query('SELECT * FROM SIGNUP WHERE id=?',[userId])
        if(findUser.length>0){
            const [getTwitte]=await db.query('SELECT * FROM TWITTES WHERE userid=?',[userId])
            if(getTwitte.length>0){
                const encryptedData=await encryptData({message:"twitte fetched",twittes:getTwitte,success:true})
                return res.status(200).json({data:encryptedData})
            }
            const encryptedData=await encryptData({message:"no not found",success:false})
            return res.status(500).json({data:encryptedData})
        }
        const encryptedData=await encryptData({message:"user not exist",success:false})
        return res.status(500).json({data:encryptedData})
     
    } catch (error) {
        const encryptedData= encryptData({message:error,success:false})
        return res.status(500).json({data:encryptedData})
    }
}

async function updateTwitteController(req,res) {
    const data=decryptData(req.body)
    const {text,image,twitteId}=data
    try {
        const [findTwitte]=await db.query('SELECT * FROM TWITTES WHERE id=?',[twitteId])
        if(findTwitte.length>0){
            const [updateTwitte]=await db.query('UPDATE TWITTES SET text=?,image=? WHERE id=?',[text,image,twitteId])
            if(updateTwitte.affectedRows>0){
                const encryptedData=await encryptData({message:"twitte updated",success:true})
                return res.status(200).json({data:encryptedData})
            }
            const encryptedData=await encryptData({message:"internal server error",success:false})
            return res.status(500).json({data:encryptedData})
        }
        const encryptedData=await encryptData({message:"twitte not exist",success:false})
        return res.status(500).json({data:encryptedData})
     
    } catch (error) {
        const encryptedData= encryptData({message:error,success:false})
        return res.status(500).json({data:encryptedData})
    }
}


async function deleteTwitteController(req,res) {

    const twitteId=req.params()
    try {
        const [findTwitte]=await db.query('SELECT * FROM TWITTES WHERE id=?',[twitteId])
        if(findTwitte.length>0){
            const [deleteTwitte]=await db.query('DELETE FROM TWITTES WHERE id=?',[twitteId])
            if(deleteTwitte.affectedRows>0){
                const encryptedData=await encryptData({message:"twitte deleted",success:true})
                return res.status(200).json({data:encryptedData})
            }
            const encryptedData=await encryptData({message:"internal server error",success:false})
            return res.status(500).json({data:encryptedData})
        }
        const encryptedData=await encryptData({message:"twitte not exist",success:false})
        return res.status(500).json({data:encryptedData})
     
    } catch (error) {
        const encryptedData= encryptData({message:error,success:false})
        return res.status(500).json({data:encryptedData})
    }
}


async function getAllTwitteController(req,res) {
    try {
            const [getTwitte]=await db.query('SELECT * FROM TWITTES ')
            if(getTwitte.length>0){
                const encryptedData=await encryptData({message:"twitte fetched",twittes:getTwitte,success:true})
                return res.status(200).json({data:encryptedData})
            }
            const encryptedData=await encryptData({message:"no not found",success:false})
            return res.status(500).json({data:encryptedData})
     
    } catch (error) {
        const encryptedData= encryptData({message:error,success:false})
        return res.status(500).json({data:encryptedData})
    }
}

export {createTwitteController,getTwitteController,updateTwitteController,deleteTwitteController,getAllTwitteController}