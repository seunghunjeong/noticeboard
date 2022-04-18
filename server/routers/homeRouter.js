const router = require('express').Router();
const db = require('../config/db');

// logger
const logger = require('../logger');

// new board list
router.get("/getNewBoardList", (req, res) => {
 
    // select 시작
    let sqlQuery = "SELECT * FROM board.noticeboard ORDER BY regist_date desc limit 3";//limit 3 = 3개만 보여주기(postSql)

    // ?에 키워드 넣기.
    db.query(sqlQuery, (err, result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    })
})

module.exports = router;