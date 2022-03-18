const express = require('express');
const app = express();
const db = require('./config/db');
const mysql = require('mysql')
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
// node.js의 포트 설정. 기본 포트는 8000.
const PORT = process.env.port || 8000;
const cors = require('cors');


// 크롬에서 cors 에러 방지용
app.use(cors());
// express.json 사용
app.use(express.json());
// application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// login
app.post("/api/user/login", (req, res) => {

    // id, pw 선언
    const id = req.query.id
    const pw = req.query.pw
    
    // 입력된 id 와 동일한 id 가 mysql 에 있는 지 확인
    const SQLconfirmId = 'SELECT COUNT(*) AS result FROM board.member WHERE id = ?'

    db.query(SQLconfirmId, id, (err, data) => {
        if(!err) {
        	// 결과값이 1보다 작다면(동일한 id 가 없다면)
            if(data[0].result < 1) {
                res.send({ 'msg': '입력하신 id 가 일치하지 않습니다.'})
            } else { // 동일한 id 가 있으면 비밀번호 일치 확인
                const SQLconfirmPw = `SELECT 
                                CASE (SELECT COUNT(*) FROM board.member WHERE id = ? AND password = ?)
                                    WHEN '0' THEN NULL
                                    ELSE (SELECT 
                                        id FROM board.member WHERE id = ? AND password = ?)
                                END AS userId
                                , CASE (SELECT COUNT(*) FROM board.member WHERE id = ? AND password = ?)
                                    WHEN '0' THEN NULL
                                    ELSE (SELECT password FROM board.member WHERE id = ? AND password = ?)
                                END AS userPw`;

                // sql 란에 필요한 parameter 값을 순서대로 기재
                const params = [id, pw, id, pw, id, pw, id, pw]
                
                db.query(SQLconfirmPw, params, (err, data) => {
                    if(!err) {
                        res.send(data[0])
                    } else {
                        res.send(err)
                    }
                })
            }
        } else {
            res.send(err)
        }
    })
})
  
// board list
app.get("/api/getBoardList", (req, res) => {
    const sqlQuery = "SELECT * FROM board.noticeboard";
    db.query(sqlQuery, (err, result) => {
        res.send(result);
    })
})

// board detail
app.post("/api/getBoardDetail", (req, res) => {
    const idx = req.body.idx;
    const sqlQuery = "SELECT * FROM board.noticeboard WHERE idx = ?";
    db.query(sqlQuery, [idx], (err, result) => {
        if(err) return res.status(400).send(err);
        
        return res.status(200).send(result);
    })
})

// board insert
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

// board update
app.post("/api/updateBoard", (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const idx = req.body.idx;

    const sqlQuery = "UPDATE board.noticeboard SET title = ?, content = ? WHERE idx = ?";

    db.query(sqlQuery, [title, content, idx], (err, result) => {
        if(err){
            res.send("error : " + err );
        } else {
            res.send("success");
        }
    })
})

// board delete
app.post("/api/deleteBoard", (req, res) => {
    const idx = req.body.idx;
    const sqlQuery = "DELETE FROM board.noticeboard WHERE idx = ?";

    db.query(sqlQuery, [idx], (err, result) => {
        if(err) return res.status(400).send(err);
        
        return res.status(200).send("success");
    })
})






app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});