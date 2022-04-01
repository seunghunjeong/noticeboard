const router = require('express').Router();
const db = require('../config/db');

// logger
const logger = require('../logger');

// 카테고리 목록 가져오기
router.post("/getCateGory", (req, res) => {
    
    const sqlQuery = `
        SELECT
            A.category as category ,
            A.idx as idx,
            A.description as description,
            count(B.category) as count
        FROM 
            boardCategory A 
        LEFT JOIN 
            noticeboard B
        ON 
            A.category = B.category 
        GROUP by 
            A.category 
    `;

    db.query(sqlQuery, (err, result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    });

})

module.exports = router;