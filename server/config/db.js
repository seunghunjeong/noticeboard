const mysql = require("mysql");

// mysql db 접속
const db = mysql.createConnection({
    host: "192.168.0.177",
    user: "cmworld",
    password: "Cmworld@1234",
    database: "board"
});
  

db.connect((err) => {
    if (err) {
        console.log(err);
        db.end();
        throw err;
    } else {
        console.log("mysql DB connection!");
    }
});


module.exports = db;