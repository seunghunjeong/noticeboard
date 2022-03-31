const mysql = require("mysql");

// mysql db 접속
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
  

db.connect((err) => {
    if (err) {
        console.log(err);
        db.end();
        throw err;
    } else {
        console.log("DB 접속 성공");
    }
});


module.exports = db;