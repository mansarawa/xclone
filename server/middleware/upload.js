import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const profileDir = "uploads/profile/";
const backgroundDir = "uploads/background/";
const twitteDir="uploads/twitte/"

if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
}
if (!fs.existsSync(backgroundDir)) {
    fs.mkdirSync(backgroundDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "photo") {
            cb(null, profileDir); 
        } else if (file.fieldname === "bphoto") {
            cb(null, backgroundDir); 
        } else if (file.fieldname === "image") {
            cb(null, twitteDir); 
        }
        else {
            cb(new Error("Invalid file field"), null);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
}).fields([
    { name: "photo", maxCount: 1 },  
    { name: "bphoto", maxCount: 1 } ,
    {name:"image",maxCount:1}
]); 
