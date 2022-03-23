const cors = require('cors');
const router = require('express').Router();
const bodyParser = require('body-parser');
const db = require('../config/db');


router.use(bodyParser.json());
router.use(cors());

router.post('/insert', (req, res) => {
    const report = req.body.report;
    const writer = req.body.writer;
    const date = req.body.date;
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
                '${report}',
                '${writer}',
                'test',
                '${date}'
            )`;
    db.query(sqlQuery, (err, result) => {
        res.send(result);
    });
});


module.exports = router;