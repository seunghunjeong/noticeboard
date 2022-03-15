const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./config/db');

app.get('/', (req, res) => {
    db.query("SELECT * FROM board.noticeboard", (err, data) => {
        if(!err) res.send({ products : data });
        else res.send(err);
    })
})


app.listen(port, () => console.log(`test app listening on port ${port}!`)); 

