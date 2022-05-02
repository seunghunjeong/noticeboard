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
            return res.status(400).send(err);
        }
        return res.status(200).send(result);
    })
})

// timeline view
router.post("/getTimelineThisWeekList", (req, res) => {
    const this_monday = req.body.this_monday;
    const this_sunday = req.body.this_sunday;

    const sqlQuery = "select leave_start , GROUP_CONCAT(username) as username, GROUP_CONCAT(leave_type) as leave_type, GROUP_CONCAT(idx) as idx, GROUP_CONCAT(IFNULL(memo, '')) as memo"
                   + " FROM timelineInfo"
                   + " GROUP BY leave_start"
                   + " HAVING leave_start BETWEEN ? AND ?"
                   + " ORDER BY leave_start ASC"
 
    db.query(sqlQuery, [this_monday, this_sunday], (err, result) => {
        if (err) {
            logger.error(err);
            return res.status(400).send(err);
        }
        return res.status(200).send(result);
    })
})

router.post("/getTimelineNextWeekList", (req, res) => {
    const next_monday = req.body.next_monday;
    const next_sunday = req.body.next_sunday;

    const sqlQuery = "select leave_start , GROUP_CONCAT(username) as username, GROUP_CONCAT(leave_type) as leave_type, GROUP_CONCAT(idx) as idx, GROUP_CONCAT(IFNULL(memo, '')) as memo"
                   + " FROM timelineInfo"
                   + " GROUP BY leave_start"
                   + " HAVING leave_start BETWEEN ? AND ?"
                   + " ORDER BY leave_start ASC"
 
    db.query(sqlQuery, [next_monday, next_sunday], (err, result) => {
        if (err) {
            logger.error(err);
            return res.status(400).send(err);
        }
        return res.status(200).send(result);
    })
})


// timeline insert
router.post("/timelineRegister", (req, res) => {

    const userid = req.body.userid;
    const username = req.body.username;
    const selectLeaveType = req.body.selectLeaveType;
    const selectLeaveDateStart = req.body.selectLeaveDateStart;
    const memo = req.body.memo;

    const sqlQuery = "INSERT INTO board.timelineInfo (userid, username, leave_type, leave_start, memo) VALUES (?, ?, ?, ?, ?)"
                  
    db.query(sqlQuery, [userid, username, selectLeaveType, selectLeaveDateStart, memo], (err, result) => {
        if (err) {
            logger.error(err);
            return res.status(400).send(err);
        }
        return res.status(200).send(result);
    })
})

// timeline one view
router.post("/getTimelineInfo", (req, res) => {
    
    const idx = req.body.idx;

    const sqlQuery = "select *"
                   + " FROM timelineInfo"
                   + " WHERE idx = ?"
 
    db.query(sqlQuery, [idx], (err, result) => {
        if (err) {
            logger.error(err);
            return res.status(400).send(err);
        }
        return res.status(200).send(result);
    })
})

// timeline one update
router.post("/updateTimelineOne", (req, res) => {
    
    
    const idx = req.body.idx;
    const selectLeaveType = req.body.selectLeaveType;
    const selectLeaveDateStart = req.body.selectLeaveDateStart;
    const memo = req.body.memo;

    const sqlQuery = "UPDATE timelineInfo"
                   + " SET leave_type = ?, leave_start = ?, memo = ?"
                   + " WHERE idx = ?"
 
    db.query(sqlQuery, [selectLeaveType, selectLeaveDateStart, memo, idx], (err, result) => {
        if (err) {
            logger.error(err);
            return res.status(400).send(err);
        }
        return res.status(200).send(result);
    })
})


// timeline one delete
router.post("/deleteTimelineOne", (req, res) => {
    
    const idx = req.body.idx;

    const sqlQuery = "DELETE"
                   + " FROM timelineInfo"
                   + " WHERE idx = ?"
 
    db.query(sqlQuery, [idx], (err, result) => {
        if (err) {
            logger.error(err);
            return res.status(400).send(err);
        }
        return res.status(200).send(result);
    })
})
// 잔여 연차일수 가져오기
router.post("/getLeaveCount", (req, res) => {
    
    const id = req.body.id;

    const sqlQuery = "SELECT leave_count FROM users WHERE id = ?"
 
    db.query(sqlQuery, [id], (err, result) => {
        if (err) {
            logger.error(err);
            return res.json({message: "error"})
        }
        return res.json({message : "success", result : result})
    })
})

// 잔여 연차일수 수정
router.post("/updateLeaveCount", (req, res) => {
    
    const id = req.body.userid;
    const leaveCount = req.body.count;

    const sqlQuery = "UPDATE users"
                    + " SET leave_count = ?"
                    + " WHERE id = ?"
 
    db.query(sqlQuery, [leaveCount, id], (err, result) => {
        if (err) {
            logger.error(err); 
            return res.json({message: "error"})
        }
        return res.json({message: "success", result : result})
        
    })
})

module.exports = router;