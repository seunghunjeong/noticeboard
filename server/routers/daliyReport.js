const router = require('express').Router();
const db = require('../config/db');

// logger
const logger = require('../logger');

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
        if (err) {
            logger.error(err);
        }
        res.send(result);
    });
});

// 일일보고 리스트 불러오기
router.get("/getMyReport", (req, res) => {

    const sqlQuery = `
    SELECT 
            a.idx,
            a.id,
            a.writer,
            a.report,
            a.plan,
            a.regist_date,
            b.department,
            b.position 	
        FROM 
            board.dailyReport a
        LEFT JOIN
            board.users b
        ON
            a.id = b.id
        WHERE
            b.department = '${req.query.department}'
        AND
            a.id = '${req.query.id}'
    `;

        
    db.query(sqlQuery, (err, result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    })

});

// 일일보고 전체 리스트 불러오기
router.get("/getReportDetail", (req, res) => {
    
    const sqlQuery = `
        SELECT 
            a.idx,
            a.id,
            a.writer,
            a.report,
            a.plan,
            a.regist_date,
            b.department,
            b.position 	
        FROM 
            board.dailyReport a
        LEFT JOIN
            board.users b
        ON
            a.id = b.id
        WHERE
            b.department = '${req.query.department}'
        ORDER BY
            b.position ASC
        `;


    db.query(sqlQuery, (err, result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    })

});

// 일일보고 업데이트
router.post("/update", (req, res) => {

    const sqlQuery = `
        UPDATE
            board.dailyReport
        SET
            report = '${req.body.content}',
            plan = '${req.body.plan}',
            regist_date = '${req.body.date}'
        WHERE
            idx = '${req.body.idx}'
    `;

    db.query(sqlQuery, (err, result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    });

})

// 일일보고 삭제
router.post("/delete", (req, res) => {
    const sqlQuery = `
        DELETE FROM
            board.dailyReport
        WHERE
            idx = '${req.body.idx}'
    `;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    });
})

// 모바일
// 일일보고
router.post("/insertM", (req, res) => {

    const sqlQuery = "INSERT INTO dailyReport (id, writer, report, plan, regist_date) VALUES(?, ?, ?, ?, ?);";
    db.query(sqlQuery, [req.body.id, req.body.writer, req.body.report, req.body.plan, req.body.regist_date], (err, result) => {
        if (err) {
            logger.error(err);
            return res.status(400).send(err);
        }

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
        if (err) {
            logger.error(err);
        }
        res.send(result);
    });

})

module.exports = router;