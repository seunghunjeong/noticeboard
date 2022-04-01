const router = require('express').Router();
const db = require('../config/db');

// logger
const logger = require('../logger');

// 카테고리 추가
router.post("/addCategory", (req, res) => {
    let check;
    const checkQuety = `
        SELECT COUNT(*) as COUNT 
        FROM
            boardCategory
        WHERE
            category = '${req.body.category}'
    ` 
    db.query(checkQuety, (err, result) => {
        check = result[0].COUNT === 1 ? false : true ;

        if (err) {
            logger.error(err);
        }

        if(check){ 
            console.log('test');
            const sqlQuery = `
                INSERT INTO
                    boardCategory
                    (
                        category,
                        description,
                        idx
                    )
                    VALUES
                    (
                        '${req.body.category}',
                        '${req.body.description}',
                        (select idx from (select ifnull(max(idx),0)+1 as idx from boardCategory) tmp)
                    )
                `;
        
            db.query(sqlQuery, (err, result) => {
                if (err) {
                    logger.error(err);
                }
                res.send(result);
            });
        } else {
            res.send('중복');
        }
    })
})

// 카테고리 삭제
router.post('/delCategory', (req, res) => {
    const sqlQuery = `
        DELETE FROM
            boardCategory
        WHERE
            category = '${req.body.category}'
    `

    db.query(sqlQuery, (err,result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    });
})

// 카테고리 수정
router.post('/udtCategory', (req, res) => {

    console.log(req.body);
    const sqlQuery = `
        UPDATE
            boardCategory
        SET
            category = '${req.body.category}',
            description = '${req.body.description}'
        WHERE
            idx = '${req.body.idx}'
    `;

    db.query(sqlQuery,(err,result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    });
})

// 게시글 수 불러오기 
router.post('/getCount', (req, res) => {

    const sqlQuery = `
        SELECT
            count(*) as count,
            category
        FROM
            noticeboard
        GROUP BY
            category
    `
    db.query(sqlQuery, (err, result) => {
        if (err) {
            logger.error(err);
        }
        res.send(result);
    });
})

module.exports = router;