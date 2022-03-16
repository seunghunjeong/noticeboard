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
    const sqlQuery = "SELECT * FROM noticeboard";
    db.query(sqlQuery, (err, result)=>{
        res.send(result);
    })
})

app.get("/api/read", (req, res)=>{
    const idx = req.query.idx;
    const sqlQuery = "SELECT * FROM noticeboard where idx = ?";
    db.query(sqlQuery, [idx], (err,result) =>{
        if(err){
            res.send(result + err);
        } else {
            res.send(result);
        }
    });
})

app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`);
});