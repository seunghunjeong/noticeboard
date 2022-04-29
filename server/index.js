const express = require('express');
const app = express();
// const cors = require('cors');
const bodyParser = require('body-parser');

// data base
require('dotenv').config({path : "./config/config.env"}); 
const db = require('./config/db');

// set up port
const PORT = process.env.port || 8000;

// use set 
// var corsOptions = {
//     origin: "http://localhost:3000",
//     methods: ['GET', 'POST', 'OPTIONS'],
//     credentials: true
// };
// app.use(cors(corsOptions));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(function(req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       //"x-access-token, Origin, Content-Type, Accept"
//       "http://localhost:3000"
//     );
//     next();
// });

// add routes
const loginRouter = require('./routers/loginRouter');
const dailyReportRouter = require('./routers/daliyReport');
const boardRouter = require('./routers/board');
const navRouter = require('./routers/nav');
const adminRouter = require('./routers/admin');
const homeRouter = require('./routers/homeRouter');
const mypageRouter = require('./routers/mypageRouter');

app.use('/admin', adminRouter);
app.use('/nav', navRouter);
app.use('/board', boardRouter);
app.use('/report', dailyReportRouter);
app.use('/api', loginRouter);
app.use('/home', homeRouter);
app.use('/mypage', mypageRouter);

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});

