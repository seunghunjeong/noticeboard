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

// board list
app.get("/api/getBoardList", (req, res) => {
    const sqlQuery = "SELECT * FROM board.noticeboard";
    db.query(sqlQuery, (err, result) => {
        res.send(result);
    })
})

// board detail
app.post("/api/getBoardDetail", (req, res) => {
    const id = req.body.id;
    const sqlQuery = "SELECT * FROM board.noticeboard WHERE idx = ?";

    db.query(sqlQuery, [id], (err, result) => {
        if(err) return res.status(400).send(err);
        
        return res.status(200).send(result);
    })
})





app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});