const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// data base
const db = require('./config/db');

// set up port
const PORT = process.env.port || 8000;

// use set 
var corsOptions = {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    exposedHeaders: ["set-Cookie"]
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      //"x-access-token, Origin, Content-Type, Accept"
      "http://localhost:3000"
    );
    next();
});

// add routes
const loginRouter = require('./routers/loginRouter');
const dailyReportRouter = require('./routers/daliyReport');
const boardRouter = require('./routers/board');
const navRouter = require('./routers/nav');
const adminRouter = require('./routers/admin');

app.use('/admin', adminRouter);
app.use('/nav', navRouter);
app.use('/board', boardRouter);
app.use('/report', dailyReportRouter);
app.use('/api', loginRouter);

// 모바일용 일일보고
app.post("/api/insertR", (req, res)=>{
    /* console.log(req.body.id); */
    
    const sqlQuery = "INSERT INTO dailyReport (id, writer, report, regist_date) VALUES(?, ?, ?, ?);";
    db.query(sqlQuery, [req.body.id,req.body.writer,req.body.report,req.body.regist_date], (err,result) => {
        if(err) return res.status(400).send(err);

        return res.status(200).send(result);
    }) 
})


app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});

