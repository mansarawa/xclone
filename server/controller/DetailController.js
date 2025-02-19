import db from '../config/dbConfig.js'
import decryptData from '../helper/decryptData.js'
import encryptData from '../helper/encryptData.js'
async function addDetailController(req,res) {
    const data=decryptData(req.body.encryptedData)
    console.log(data)
    const {name,username,phone,bio,userid}=data
    try {
        const [findUser]=await db.query('SELECT * FROM SIGNUP WHERE id=?',[userid])
        if(findUser.length>0){
            const [newDetail]=await db.query('INSERT INTO PDETAIL (name,username,bio,phone,userid) VALUES (?,?,?,?,?)',[name,username,bio,phone,userid])
            if(newDetail.affectedRows>0){
                const encryptedData=await encryptData({message:"detail added",success:true})
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

async function getDetailController(req,res) {
    const userId=req.params()
    try {
        const [findUser]=await db.query('SELECT * FROM SIGNUP WHERE id=?',[userId])
        if(findUser.length>0){
            const [getDetail]=await db.query('SELECT * FROM PDETAIL WHERE userid=?',[userId])
            if(getDetail.length>0){
                const encryptedData=await encryptData({message:"detail fetched",twittes:getDetail,success:true})
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

export {addDetailController,getDetailController}