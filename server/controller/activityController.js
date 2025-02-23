import decryptData from "../helper/decryptData.js"
import encryptData from "../helper/encryptData.js"
import db from '../config/dbConfig.js'
async function addActivityController(req, res) {
    const data = decryptData(req.body.encryptedData);
    console.log(data);
    const { comment, like, bookmark, repost, twiteeid, userid } = data;

    try {
        // Check if the user exists
        const [findUser] = await db.query('SELECT * FROM SIGNUP WHERE id = ?', [userid]);
        if (findUser.length === 0) {
            const encryptedData = await encryptData({ message: "User not exist", success: false });
            return res.status(404).json({ data: encryptedData });
        }

        
        const [existingActivity] = await db.query(
            'SELECT * FROM ACTIVITY WHERE userid = ? AND twiteeid = ?',
            [userid, twiteeid]
        );

        if (existingActivity.length > 0) {
           
            const [updateActivity] = await db.query(
                'UPDATE ACTIVITY SET comment = ?, `like` = ?, bookmark = ?, repost = ? WHERE userid = ? AND twiteeid = ?',
                [comment, like, bookmark, repost, userid, twiteeid]
            );

            if (updateActivity.affectedRows > 0) {
                const encryptedData = await encryptData({ message: "Activity updated", success: true });
                return res.status(200).json({ data: encryptedData });
            }
        } else {
            
            const [newActivity] = await db.query(
                'INSERT INTO ACTIVITY (comment, `like`, bookmark, repost, twiteeid, userid) VALUES (?, ?, ?, ?, ?, ?)',
                [comment, like, bookmark, repost, twiteeid, userid]
            );

            if (newActivity.affectedRows > 0) {
                const encryptedData = await encryptData({ message: "Activity added", success: true });
                return res.status(200).json({ data: encryptedData });
            }
        }

        const encryptedData = await encryptData({ message: "Internal server error", success: false });
        return res.status(500).json({ data: encryptedData });

    } catch (error) {
        console.log(error);
        const encryptedData = await encryptData({ message: error.message, success: false });
        return res.status(500).json({ data: encryptedData });
    }
}

async function addtTwitterActivityController(req, res) {
    const data = decryptData(req.body.encryptedData);
    console.log(data);
    const { twitteid, type, userId } = data; 

    if (!twitteid || !userId || !["like", "repost", "bookmark"].includes(type)) {
        return res.status(400).json({ message: "Invalid request" });
    }

    try {
        
        await db.query(`
            INSERT INTO tactivity (userid, twitteid, \`${type}\`) 
            VALUES (?, ?, 1) 
            ON DUPLICATE KEY UPDATE \`${type}\` = \`${type}\` + 1
        `, [userId, twitteid]);
        
        
        const encryptedData = await encryptData({ message: "updated success", success: true });
        return res.status(200).json({ data: encryptedData });
        
    } catch (error) {
        console.log(error);
        const encryptedData = await encryptData({ message: error.message, success: false });
        return res.status(500).json({ data: encryptedData });
    }
}


async function getActivityController(req,res) {
    const twiteeid=req.params()
    try {
        const [findUser]=await db.query('SELECT * FROM TWITEE WHERE id=?',[twiteeid])
        if(findUser.length>0){
            const [getDetail]=await db.query('SELECT t.*, A.* FROM TWITTES T LEFT JOIN ACTIVITY A ON T.id = A.id ')
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
export {addActivityController,addtTwitterActivityController}