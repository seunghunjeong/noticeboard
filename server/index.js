const express = require('express');
const app = express();
const db = require('./config/db');
const mysql = require('mysql')
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
// node.js의 포트 설정. 기본 포트는 8000.
const PORT = process.env.port || 8000;
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 크롬에서 cors 에러 방지용
app.use(cors());
// express.json 사용
app.use(express.json());
// application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// 파일저장경로, 폴더가없다면 생성함
const directory = fs.existsSync('C:/uploadtest');
if(!directory) fs.mkdirSync('C:/uploadtest');

//diskStorage 엔진으로 파일저장경로와 파일명을 세팅한다. 
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:/uploadtest');
    },
    filename: function (req, file, cb) {
        cb(null, getFile(file));
    }
});

// 파일명 셋팅
function getFile(file) {
    let oriFile = file.originalname;
    let ext = path.extname(oriFile);
    let name = path.basename(oriFile, ext);
    let rnd = Math.floor(Math.random() * 90) + 10; // 10 ~ 99
    return Date.now() + '-' + rnd + '-' + name + ext;
}

let upload = multer({
    storage: storage
});



// board insert
app.post("/api/insert", upload.any(), (req, res)=>{
    const title = req.body.title;
    const content = req.body.content;
    let filePath = "";

    for( let i = 0; i< req.files.length; i++){
        filePath = filePath.concat(req.files[i].path);
        if(i !== req.files.length - 1){
            filePath = filePath + ',';
        }
    }
    
    const sqlQuery = "INSERT INTO noticeboard (title,content,writer,file_path) VALUES (?,?,'임시작성자',?)";
    db.query(sqlQuery, [title,content,filePath], (err,result) => {
        if(err) return res.status(400).send(err);

        return res.status(200).send(result);
    })


})

// board list
app.get("/api/getBoardList", (req, res) => {
    const sqlQuery = "SELECT * FROM board.noticeboard order by regist_date desc";
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

// board update
app.post("/api/updateBoard", upload.any(), (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const idx = req.body.idx;
    let filePath = "";

    const sqlQuery = "UPDATE board.noticeboard SET title = ?, content = ?, file_path = ? WHERE idx = ?";

    db.query(sqlQuery, [title, content, filePath, idx], (err, result) => {
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