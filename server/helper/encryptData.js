import CryptoJS from "crypto-js"
export default function encryptData(data){
    
    const encryptedData=CryptoJS.AES.encrypt(JSON.stringify(data),process.env.SECRET_KEY).toString()
  

    return encryptedData

}