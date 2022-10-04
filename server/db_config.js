var mysql = require('mysql2');
require('dotenv').config({ path: '.env'}); 
const db_info = {
    host : `${process.env.DB_HOST}`,
    user : `${process.env.DB_ID}`,
    password : `${process.env.DB_PWD}`,
    database : "bigchoi"
}

module.exports = {
    init: function () {
        console.log(db_info)
        return mysql.createConnection(db_info);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else console.log('mysql is connected successfully!');
        });
    }
}