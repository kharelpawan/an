const mysql = require("mysql")

const mySqlConnection = mysql.createConnection({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:"root",
    password:"",
    database:"test"
})

mySqlConnection.connect((err) => {
    if(!err){
        console.log('DB conncetion succeded.')
    }else{
        console.log('DB conncetion failed \n Error:  '+ JSON.stringify(err,undefined,2))
    }
})

module.exports = mySqlConnection;