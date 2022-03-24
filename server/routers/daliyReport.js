const cors = require('cors');
const router = require('express').Router();
const bodyParser = require('body-parser');
const db = require('../config/db');


router.use(bodyParser.json());
router.use(cors());

// 일일보고 등록
router.post('/insert', (req, res) => {
    const sqlQuery = `
        INSERT INTO 
        dailyReport
            (
                writer,
                report,
                id,
                regist_date
            )
        VALUES
            (
                '${req.body.writer}',
                '${req.body.report}',
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
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);
    const sqlQuery = `
    SELECT * 
    FROM 
        dailyReport
    WHERE
        id = '${req.query.id}'`;

    db.query(sqlQuery, (err, result) => {
        res.send(result);
    })

});

// 일일보고 리스트 불러오기
router.get("/getReportDetail", (req, res) => {
    const sqlQuery = `SELECT * FROM dailyReport`;

    db.query(sqlQuery, (err, result) => {
        res.send(result);
    })

});

// 일일보고 업데이트
router.post("/update", (req, res) => {

    const sqlQuery = `
        UPDATE dailyReport
        SET
            report = '${req.body.content}',
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
            dailyReport
        WHERE
            idx = '${req.body.idx}'
    `;
    db.query(sqlQuery,(err,result) => {
        res.send(result);
    });
})

module.exports = router;