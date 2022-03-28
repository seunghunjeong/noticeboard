const cors = require('cors');
const router = require('express').Router();
const bodyParser = require('body-parser');
const db = require('../config/db');

var corsOptions = {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    exposedHeaders: ["set-Cookie"]
};

router.use(bodyParser.json());
router.use(cors(corsOptions));
router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      //"x-access-token, Origin, Content-Type, Accept"
      "http://localhost:3000"
    );
    next();
});

// 카테고리 추가
router.post("/addCategory",(req,res) => {
    
    const sqlQuery = `
        INSERT INTO
            boardCategory
            (
                category,
                idx
            )
            VALUES
            (
                '${req.body.category}',
                (select idx from (select ifnull(max(idx),0)+1 as idx from boardCategory) tmp)
            )
        `;

    db.query(sqlQuery, (err,result) => {
        console.log(result);
        console.log(err);
        res.send(result);
    });

})

module.exports = router;