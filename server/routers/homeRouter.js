const router = require('express').Router();
const db = require('../config/db');

// logger
const logger = require('../logger');

// new board list
router.get("/getNewBoardList", (req, res) => {
 
    // select 시작
    const sqlQuery = "SELECT * FROM board.noticeboard ORDER BY regist_date desc "//limit 3";//limit 3 = 3개만 보여주기(postSql)

    // ?에 키워드 넣기.
    db.query(sqlQuery, (err, result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    })
})

// timeline view
router.post("/getTimelineThisWeekList", (req, res) => {
    const this_monday = req.body.this_monday;
    const this_sunday = req.body.this_sunday;

    // const sqlQuery = "SELECT * FROM board.timelineInfo"   
    //                + " WHERE leave_start BETWEEN ? AND ?"
    //                + " ORDER BY leave_start ASC"

    const sqlQuery = "select leave_start , GROUP_CONCAT(username) as username, GROUP_CONCAT(leave_type) as leave_type, GROUP_CONCAT(idx) as idx"
                   + " FROM timelineInfo"
                   + " GROUP BY leave_start"
                   + " HAVING leave_start BETWEEN ? AND ?"
                   + " ORDER BY leave_start ASC"
 
    db.query(sqlQuery, [this_monday, this_sunday], (err, result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    })
})

router.post("/getTimelineNextWeekList", (req, res) => {
    const next_monday = req.body.next_monday;
    const next_sunday = req.body.next_sunday;

    // const sqlQuery = "SELECT * FROM board.timelineInfo"   
    //                + " WHERE leave_start BETWEEN ? AND ?"
    //                + " ORDER BY leave_start ASC"

    const sqlQuery = "select leave_start , GROUP_CONCAT(username) as username, GROUP_CONCAT(leave_type) as leave_type, GROUP_CONCAT(idx) as idx"
                   + " FROM timelineInfo"
                   + " GROUP BY leave_start"
                   + " HAVING leave_start BETWEEN ? AND ?"
                   + " ORDER BY leave_start ASC"
 
    db.query(sqlQuery, [next_monday, next_sunday], (err, result) => {
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
    const selectLeaveDateStart = req.body.selectLeaveDateStart;
    
    const sqlQuery = "INSERT INTO board.timelineInfo (userid, username, leave_type, leave_start) VALUES (?, ?, ?, ?)"
                  
    db.query(sqlQuery, [userid, username, selectLeaveType, selectLeaveDateStart], (err, result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    })
})

module.exports = router;