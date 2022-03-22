const express = require('express');
const cors = require('cors')
const router = express.Router();
const db = require('../config/db');
router.use(cors());

// 암호화
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10; //암호화를 몇 번시킬지 정하는 숫자


const userMiddleware = require('../middleware/users.js');

//회원가입
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

//로그인
router.post('/login', (req, res, next) => {

  const id = req.body.id;
  const password = req.body.password;
  const sqlLogin = 'SELECT * FROM board.users WHERE id = ?'
  
  db.query(sqlLogin, [id], (err, result) => {
      // 유저 존재하지않음
      if (err) {
        return res.json({
          msg: err
        });
      }

      if (!result.length) {
        return res.json({
          msg: '아이디와 패스워드가 틀렸습니다.'
        });
      }

      //암호화된 비밀번호를 바로 복호화시킬순 없기때문에
      //원래의 비밀번호를 암호화시킨후 맞는지 확인해야한다.
      bcrypt.compare(password, result[0]['password'], (bErr, bResult) => {
          // wrong password
          if (bErr) {
            return res.json({
              msg: "패스워드가 틀렸습니다."
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

            return res.json({
              msg: '로그인 성공',
              token,
              user: result[0],
              success : true
            });
          }
          return res.json({
            msg: '아이디나 패스워드가 틀렸습니다.'
          });
        }
      );
    }
  );
});


// router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
//     console.log(req.userData);
//     res.send('This is the secret content. Only logged in users can see that!');
// });


module.exports = router;