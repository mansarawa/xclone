import CryptoJS from "crypto-js"
export default function decryptData(data){
    try {
        
        const bytes=CryptoJS.AES.decrypt(data,process.env.SECRET_KEY)
        
        const decrypteText=bytes.toString(CryptoJS.enc.Utf8)
        
        const decrypt=JSON.parse(decrypteText)
        
        return decrypt
    } catch (error) {
        console.log(error)
    }

}