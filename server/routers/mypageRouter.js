const router = require('express').Router();
const db = require('../config/db');

// logger
const logger = require('../logger');

// get my used leave list
router.post("/getMyleaveList", (req, res) => {

    const id = req.body.id;

    // select 시작
    const sqlQuery = "SELECT * FROM board.timelineInfo"
                   + " WHERE userid = ?"
                //    + " AND leave_type in ('연차', '오후반차', '오전반차', '병가', '여름휴가')"
                   + " AND (leave_type = '연차'"
                   + " OR leave_type = '오전반차'"
                   + " OR leave_type = '오후반차'"
                   + " OR leave_type = '여름휴가'"
                   + " OR leave_type = '병가')"
                   + " ORDER BY leave_start DESC"

    // ?에 키워드 넣기.
    db.query(sqlQuery, [id], (err, result) => {
        if (err) {
            logger.error(err);
            return res.status(400).send(err);
        }
        return res.status(200).send(result);
    })
})


module.exports = router;