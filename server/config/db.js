var mysql = require('mysql');

const db = mysql.createConnection({
    host: "192.168.0.177",
    user: "cmworld",
    password: "Cmworld@1234",
});

// open the MySQL connection
db.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
  });

//test
/* db.query('SELECT * FROM board.noticeboard', function (error, results, fields) {
if (error) {
    console.log(error);
}
console.log(results);
}); */

module.exports = db;