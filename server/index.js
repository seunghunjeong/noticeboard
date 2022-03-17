const express = require('express');
const app = express();
const db = require('./config/db');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
// node.js의 포트 설정. 기본 포트는 8000.
const PORT = process.env.port || 8000;
const cors = require('cors');


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

// insert 쿼리 사용
app.post("/api/insert", (req, res)=>{
    const title = req.body.title;
    const content = req.body.content;
    const sqlQuery = "INSERT INTO noticeboard (title,content,writer) VALUES (?,?,'임시작성자')";

    db.query(sqlQuery, [title,content], (err,result) => {
        if(err){
            res.send("error : " + err );
        } else {
            res.send("success");
        }
    })
})


app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`);
});