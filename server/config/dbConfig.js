import mysql from 'mysql2/promise'

// const connection=mysql.createPool({
//     user:'root',
//     host:'localhost',
//     database:'twitter',
//     password:''
// })
const connection=mysql.createPool({
    user:'if0_38464687',
    host:'mydatabase-xyz.internal',
    database:'if0_38464687_twitter',
    password:'mansarawa7773',
    port:3306
})

connection.getConnection((err,connection)=>{
    if(err){
        console.log('an error accurd during the connection',err)
    }
    else{
        console.log("connection to db successfully ✅")
    }
})

export default connection