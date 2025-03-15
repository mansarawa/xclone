import db from '../config/dbConfig.js';
import decryptData from '../helper/decryptData.js';
import encryptData from '../helper/encryptData.js';
import { upload } from '../middleware/upload.js';
import path from "path";
import fs from "fs";

import { fileURLToPath } from 'url';
async function addDetailController(req, res) {
    console.log(req.body)
    const data = decryptData(req.body.encryptedData)
    console.log(data)
    const { name, username, phone, bio, userid } = data
    try {

        const photo = req.files["photo"] ? req.files["photo"][0].path : null;
        const bphoto = req.files["bphoto"] ? req.files["bphoto"][0].path : null;

        const [findUser] = await db.query('SELECT * FROM SIGNUP WHERE id = ?', [userid]);
        if (findUser.length > 0) {
            const [newDetail] = await db.query(
                'INSERT INTO PDETAIL (name, username, bio, phone, userid, photo,bphoto) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name, username, bio, phone, userid, photo, bphoto]
            );

            if (newDetail.affectedRows > 0) {
                return res.status(200).json({ data: await encryptData({ message: "Detail added", success: true }) });
            }
            return res.status(500).json({ data: await encryptData({ message: "Internal server error", success: false }) });
        }

        return res.status(404).json({ data: await encryptData({ message: "User does not exist", success: false }) });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ data: await encryptData({ message: error.message, success: false }) });
    }
}
export default addDetailController;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const profileDir = path.join(__dirname, "../uploads/profile/");
const backgroundDir = path.join(__dirname, "../uploads/background/");

console.log("Profile Directory:", profileDir);
console.log("Background Directory:", backgroundDir);

async function editDetailController(req, res) {
    console.log(req.body);
    const data = decryptData(req.body.encryptedData);
    console.log(data);
    const { name, username, phone, bio, userid } = data;

    try {
        // Fetch existing user details
        const [findUser] = await db.query("SELECT * FROM PDETAIL WHERE userid = ?", [userid]);
        if (findUser.length === 0) {
            return res.status(404).json({ data: await encryptData({ message: "User does not exist", success: false }) });
        }

        // Get old image paths
        const oldPhoto = findUser[0].photo;
        console.log(oldPhoto)
        const oldBPhoto = findUser[0].bphoto;

        const newPhoto = req.files["photo"] ? req.files["photo"][0].path : null;
        const newBPhoto = req.files["bphoto"] ? req.files["bphoto"][0].path : null;


        if (newPhoto && oldPhoto) {
            console.log("called");
        
            // Ensure we get only the filename, not the full relative path
            const oldPhotoFilename = path.basename(oldPhoto);
            const oldPhotoPath = path.join(profileDir, oldPhotoFilename);
        
            console.log("Trying to delete:", oldPhotoPath);
        
            if (fs.existsSync(oldPhotoPath)) {
                console.log("File exists, deleting now...");
                fs.unlinkSync(oldPhotoPath);
            } else {
                console.log("File not found:", oldPhotoPath);
            }
        }
        

        if (newBPhoto && oldBPhoto) {
            console.log("called");
        
            // Ensure we get only the filename, not the full relative path
            const oldBPhotoFilename = path.basename(oldBPhoto);
            const oldBPhotoPath = path.join(backgroundDir, oldBPhotoFilename);
        
            console.log("Trying to delete:", oldBPhotoPath);
        
            if (fs.existsSync(oldBPhotoPath)) {
                console.log("File exists, deleting now...");
                fs.unlinkSync(oldBPhotoPath);
            } else {
                console.log("File not found:", oldBPhotoPath);
            }
        }
        
        const [updateDetail] = await db.query(
            "UPDATE PDETAIL SET name=?, username=?, bio=?, phone=?, photo=?, bphoto=? WHERE userid=?",
            [name, username, bio, phone, newPhoto || oldPhoto, newBPhoto || oldBPhoto, userid]
        );

        if (updateDetail.affectedRows > 0) {
            return res.status(200).json({ data: await encryptData({ message: "Detail updated", success: true }) });
        }

        return res.status(500).json({ data: await encryptData({ message: "Internal server error", success: false }) });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ data: await encryptData({ message: error.message, success: false }) });
    }
}


export { editDetailController };



async function getDetailController(req, res) {
    const userId = req.params()
    try {
        const [findUser] = await db.query('SELECT * FROM SIGNUP WHERE id=?', [userId])
        if (findUser.length > 0) {
            const [getDetail] = await db.query('SELECT * FROM PDETAIL WHERE userid=?', [userId])
            if (getDetail.length > 0) {
                const encryptedData = await encryptData({ message: "detail fetched", twittes: getDetail, success: true })
                return res.status(200).json({ data: encryptedData })
            }
            const encryptedData = await encryptData({ message: "no not found", success: false })
            return res.status(500).json({ data: encryptedData })
        }
        const encryptedData = await encryptData({ message: "user not exist", success: false })
        return res.status(500).json({ data: encryptedData })

    } catch (error) {
        const encryptedData = encryptData({ message: error, success: false })
        return res.status(500).json({ data: encryptedData })
    }
}

export { addDetailController, getDetailController }