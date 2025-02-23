import encryptData from "../helper/encryptData.js"
import db from '../config/dbConfig.js'
async function getAllUserController(req, res) {
    
    try {
        const [findUser] = await db.query('SELECT * FROM PDETAIL')
        if (findUser.length > 0) {
           
            const encryptedData = await encryptData({ message: "user fetched", users: findUser, success: true })
            return res.status(200).json({ data: encryptedData })
            
            
        }
        const encryptedData = await encryptData({ message: "user not found", success: false })
        return res.status(500).json({ data: encryptedData })

    } catch (error) {
        const encryptedData = encryptData({ message: error, success: false })
        return res.status(500).json({ data: encryptedData })
    }
}

export {getAllUserController}