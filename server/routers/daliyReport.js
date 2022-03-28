const cors = require('cors');
const router = require('express').Router();
const bodyParser = require('body-parser');
const db = require('../config/db');


var corsOptions = {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    exposedHeaders: ["set-Cookie"]
};

router.use(bodyParser.json());
router.use(cors(corsOptions));
router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      //"x-access-token, Origin, Content-Type, Accept"
      "http://localhost:3000"
    );
    next();
});

// 일일보고 등록
router.post('/insert', (req, res) => {
    const sqlQuery = `
        INSERT INTO 
            board.dailyReport
            (
                writer,
                report,
                plan,
                id,
                regist_date
            )
        VALUES
            (
                '${req.body.writer}',
                '${req.body.report}',
                '${req.body.plan}',
                '${req.body.id}',
                '${req.body.date}'
            )`;
    db.query(sqlQuery, (err, result) => {
        res.send(result);
    });
});

// 일일보고 리스트 불러오기
router.get("/getMyReport", (req, res) => {
    // where 조건 user id 넘겨서 바꿔줘야함
    const sqlQuery = `
    SELECT * 
    FROM 
        board.dailyReport
    WHERE
        id = '${req.query.id}'`;

    db.query(sqlQuery, (err, result) => {
        res.send(result);
    })

});

// 일일보고 리스트 불러오기
router.get("/getReportDetail", (req, res) => {
    const sqlQuery = `SELECT * FROM board.dailyReport`;

    db.query(sqlQuery, (err, result) => {
        res.send(result);
    })

});

// 일일보고 업데이트
router.post("/update", (req, res) => {

    const sqlQuery = `
        UPDATE board.dailyReport
        SET
            report = '${req.body.content}',
            plan = '${req.body.plan}',
            regist_date = '${req.body.date}'
        WHERE
            idx = '${req.body.idx}'
    `;

    db.query(sqlQuery, (err, result) => {
        res.send(result);
    });

})

// 일일보고 삭제
router.post("/delete", (req,res) => {
    const sqlQuery = `
        DELETE FROM
            board.dailyReport
        WHERE
            idx = '${req.body.idx}'
    `;
    db.query(sqlQuery,(err,result) => {
        res.send(result);
    });
})

// 모바일
// 일일보고
router.post("/insertM", (req, res)=>{
    /* console.log(req.body.id); */
    
    const sqlQuery = "INSERT INTO dailyReport (id, writer, report, plan, regist_date) VALUES(?, ?, ?, ?, ?);";
    db.query(sqlQuery, [req.body.id,req.body.writer,req.body.report, req.body.plan,req.body.regist_date], (err,result) => {
        if(err) return res.status(400).send(err);

        return res.status(200).send(result);
    }) 
})

// 일일보고 업데이트
router.post("/updateM", (req, res) => {

    const sqlQuery = `
        UPDATE board.dailyReport
        SET
            report = '${req.body.report}',
            plan = '${req.body.plan}',
            regist_date = '${req.body.date}'
        WHERE
            idx = '${req.body.idx}'
    `;

    db.query(sqlQuery, (err, result) => {
        res.send(result);
    });

})

module.exports = router;