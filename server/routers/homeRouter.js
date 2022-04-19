const router = require('express').Router();
const db = require('../config/db');

// logger
const logger = require('../logger');

// new board list
router.get("/getNewBoardList", (req, res) => {
 
    // select 시작
    const sqlQuery = "SELECT * FROM board.noticeboard ORDER BY regist_date desc limit 3";//limit 3 = 3개만 보여주기(postSql)

    // ?에 키워드 넣기.
    db.query(sqlQuery, (err, result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    })
})

// timeline view
router.post("/getTimelineList", (req, res) => {

    const sqlQuery = "SELECT * FROM board.timelineInfo"
 
    db.query(sqlQuery, (err, result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    })
})

// timeline insert
router.post("/timelineRegister", (req, res) => {

    const userid = req.body.userid;
    const username = req.body.username;
    const selectLeaveType = req.body.selectLeaveType;
    const selectLeaveDate = req.body.selectLeaveDate;
    
    const sqlQuery = "INSERT INTO board.timelineInfo (userid, username, leave_type, leave_start) VALUES (?, ?, ?, ?)"
 
    db.query(sqlQuery, [userid, username, selectLeaveType, selectLeaveDate], (err, result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    })
})

module.exports = router;