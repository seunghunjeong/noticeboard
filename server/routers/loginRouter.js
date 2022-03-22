const express = require('express');
const cors = require('cors')
const router = express.Router();
const db = require('../config/db');
router.use(cors());

// 암호화
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 10; //암호화를 몇 번시킬지 정하는 숫자


const userMiddleware = require('../middleware/users.js');

router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {

  const id = req.body.id;
  const password = req.body.password;
  const username = req.body.username; 
  const sqlQuery = "INSERT INTO board.users (id, username, password) VALUES (?, ?, ?)"
  
  // 비밀번호 > 암호화시켜서 insert 
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, (err, hash) => {
      db.query(sqlQuery, [id, username, hash], (err, result) => {
          if (err) {
            //throw err;
            return res.json({
              msg: err,
            })
          }
          return res.json({
            msg : "success"
          });
        }
      );
    });      
  });
});

router.post('/login', (req, res, next) => {
    db.query(
      `SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
      (err, result) => {
        // user does not exists
        if (err) {
          throw err;
          return res.status(400).send({
            msg: err
          });
        }
  
        if (!result.length) {
          return res.status(401).send({
            msg: 'Username or password is incorrect!'
          });
        }
  
        // check password
        bcrypt.compare(
          req.body.password,
          result[0]['password'],
          (bErr, bResult) => {
            // wrong password
            if (bErr) {
              throw bErr;
              return res.status(401).send({
                msg: 'Username or password is incorrect!'
              });
            }
  
            if (bResult) {
              const token = jwt.sign({
                  username: result[0].username,
                  userId: result[0].id
                },
                'SECRETKEY', {
                  expiresIn: '7d'
                }
              );
  
              db.query(
                `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
              );
              return res.status(200).send({
                msg: 'Logged in!',
                token,
                user: result[0]
              });
            }
            return res.status(401).send({
              msg: 'Username or password is incorrect!'
            });
          }
        );
      }
    );
});


router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.send('This is the secret content. Only logged in users can see that!');
});


module.exports = router;