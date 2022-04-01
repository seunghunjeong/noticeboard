const mysql = require("mysql");

// mysql db 접속
const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true, 
    connectionLimit: 10, 
    queueLimit: 0
});
  

db.getConnection((err) => {
    if (err) {
        console.log(err);
        db.release(); // Connectino Pool 반환
        throw err;
    } else {
        console.log("DB 접속 성공");
    }
});


module.exports = db;