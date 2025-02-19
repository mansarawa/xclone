import jwt from 'jsonwebtoken'
import encryptData from '../helper/encryptData.js'
async function verify(req,res,next) {
    const token=req.header('token')
    try {
        if(!token){
            const encryptedData= encryptData({message:"token required",success:false})
            return res.status(500).json({data:encryptedData})
        }
        const decodeUser=await jwt.verify(token,process.env.SECRET_KEY)
        req.user=decodeUser        
        next()
    } catch (error) {
        const encryptedData= encryptData({message:error,success:false})
        return res.status(500).json({data:encryptedData})
    }
    
}

export default verify