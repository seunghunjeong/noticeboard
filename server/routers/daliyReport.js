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
                'test',
                '${req.body.date}'
            )`;
    db.query(sqlQuery, (err, result) => {
        res.send(result);
    });
});

// 일일보고 리스트 불러오기
router.get("/getReportList", (req, res) => {

    const sqlQuery = `SELECT * FROM dailyReport`;

    db.query(sqlQuery, (err, result) => {
        res.send(result);
    })

});

// 일일보고 업데이트
router.post("/update", (req, res) => {

    console.log(req.body);
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