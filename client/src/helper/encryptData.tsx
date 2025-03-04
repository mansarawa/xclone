import CryptoJS from "crypto-js"
export default function encryptData(data:any){
    console.log(data)
    const encryptedData=CryptoJS.AES.encrypt(JSON.stringify(data),"xcloneisdonebymansa").toString()
    console.log(encryptedData)
    return encryptedData

}