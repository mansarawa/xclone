import mysql from 'mysql2/promise'

const connection=mysql.createPool({
    user:'root',
    host:'localhost',
    database:'twitter',
    password:''
})
// const connection=mysql.createPool({
//     user:process.env.DB_USER,
//     host:process.env.DB_HOST,
//     database:process.env.DB_NAME,
//     password:process.env.DB_PASSWORD,
//     port:process.env.DB_PORT
// })

connection.getConnection((err,connection)=>{
    if(err){
        console.log('an error accurd during the connection',err)
    }
    else{
        console.log("connection to db successfully ✅")
    }
})

export default connection