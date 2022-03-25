const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// data base
const db = require('./config/db');

// set up port
const PORT = process.env.port || 8000;

// use set 
var corsOptions = {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    exposedHeaders: ["set-Cookie"]
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      //"x-access-token, Origin, Content-Type, Accept"
      "http://localhost:3000"
    );
    next();
});

// add routes
const loginRouter = require('./routers/loginRouter');
const dailyReportRouter = require('./routers/daliyReport');
app.use('/report', dailyReportRouter);
app.use('/api', loginRouter);


// file upload
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const iconvLite = require('iconv-lite');
const { isGeneratorFunction } = require('util/types');

// 파일저장경로, 폴더가없다면 생성함
const uploadPath = 'C:/uploadtest';
const directory = fs.existsSync(uploadPath);
if(!directory) fs.mkdirSync(uploadPath);

//diskStorage 엔진으로 파일저장경로와 파일명을 세팅한다. 
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
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
    const writer = req.body.writer;
    let filePath = null;

    if(req.files.length === 1){ 
        filePath = req.files[0].path;
    }
    
    const sqlQuery = "INSERT INTO noticeboard (title,content,writer,file_path) VALUES (?,?,?,?)";
    db.query(sqlQuery, [title,content,writer,filePath], (err,result) => {
        if(err) return res.status(400).send(err);

        return res.status(200).send(result);
    })


})

// board list
app.get("/api/getBoardList", (req, res) => {
    // params 받기
    const filter = req.query.filter;
    const keyword = req.query.keyword;
    
    // select 시작
    let sqlQuery = "SELECT * FROM board.noticeboard";

    // filter에 따른 조건 추가
    switch (filter) {
        case '' : 
            break;
        case 'writer' :
            sqlQuery += " where writer like ?";
            break;
        case 'title' :
            sqlQuery += " where title like ?";
            break;
    }

    // 날짜순으로 정렬
    sqlQuery += " order by regist_date desc";

    // ?에 키워드 넣기.
    db.query(sqlQuery, [keyword] , (err, result) => {
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
    let deleteChk = req.body.deleteChk;

    if(deleteChk === "true") deleteChk = true;
    else deleteChk = false;

    // 원래 등록되있던 파일명을 받아옴
    let filePath = req.body.filePath; 
    if(deleteChk) {
        console.log(filePath);
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }
        filePath = null;
    }
    // 새롭게 등록된 파일이 있다면 새로 등록된 파일의 경로를 받아옴
    if(req.files.length === 1) {
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }
        filePath = req.files[0].path;
    }
    // 새롭게 등록된 파일이 없으면서 원래 등록되 있던 파일도 없는경우 
    if(filePath === "null") filePath = null;
    

    const sqlQuery = "UPDATE board.noticeboard SET title = ?, content = ?, file_path = ?, update_date = CURRENT_TIMESTAMP WHERE idx = ?";

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
    const filePath = req.body.filePath;

    // 업로드 되있던 파일이 있다면 서버 업로드 폴더에서 파일삭제
    if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath);
    }

    const sqlQuery = "DELETE FROM board.noticeboard WHERE idx = ?";

    db.query(sqlQuery, [idx], (err, result) => {
        if(err) return res.status(400).send(err);
        
        return res.status(200).send("success");
    })
})

// file Download
app.post("/api/fileDownload", (req, res)=> {
    const filePath = req.body.filePath;
    const fileName = req.body.fileName;

    try{
        // 해당 파일이 존재하는지 검사
        if(fs.existsSync(filePath)) {
            // 파일 타입 가져오기
            const mimetype = mime.getType(filePath);
            res.setHeader('Content-Disposition', `attachment; filename=` + getDownloadFilename(req, fileName));
            res.setHeader('Content-type', mimetype);
            // 파일 전송
            let fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            res.send(false);
            return;
        }
 
    } catch (e) {
        console.log(e);
        res.send('파일을 다운로드하는 중 에러가 발생하였습니다.');
        return;
    }
})

// 한글파일명 인코딩
function getDownloadFilename(req, filename) {
    var header = req.headers['user-agent'];
    
    if (header.includes("MSIE") || header.includes("Trident")) { 
        return encodeURIComponent(filename).replace(/\\+/gi, "%20");
    } else if (header.includes("Chrome")) {
        return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
    } else if (header.includes("Opera")) {
        return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
    } else if (header.includes("Firefox")) {
        return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
    }

    return filename;
}

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});

