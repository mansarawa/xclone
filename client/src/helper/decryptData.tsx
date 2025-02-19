import CryptoJS from "crypto-js"
export default function decryptData(encryptedData:any){

    try {
        console.log(encryptedData)
        const bytes=CryptoJS.AES.decrypt(encryptedData,"xcloneisdonebymansa")
        console.log(bytes)
        const decrypteText=bytes.toString(CryptoJS.enc.Utf8)
        console.log(decrypteText)
        const decrypt=JSON.parse(decrypteText)
        
        return decrypt
    } catch (error) {
        console.log(error)
        return error
    }

}