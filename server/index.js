const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
// node.js의 포트 설정. 기본 포트는 8000.
const PORT = process.env.port || 8000;
const cors = require('cors');

// mysql db 접속
const db = mysql.createPool({
    host: "192.168.0.177",
    user: "cmworld",
    password: "Cmworld@1234",
    database: "board"
});

// 크롬에서 cors 에러 방지용
app.use(cors());
// express.json 사용
app.use(express.json());
// npm qs라이브러리 사용
app.use(bodyParser.urlencoded({ extended: true }));

// select 쿼리 사용
app.get("/api/get", (req, res)=>{
    const sqlQuery = "SELECT * FROM noticeboard;";
    db.query(sqlQuery, (err, result)=>{
        res.send(result);
    })
})

app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`);
});