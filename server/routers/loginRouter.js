const express = require('express');
const router = express.Router();
const db = require('../config/db');
const cookieParser = require("cookie-parser");
const cookies = require("react-cookies");
const session = require('express-session');//session은 cookie를 이용하기 때문에 cookieParser 아래에 선언이 되야한다.
router.use(cookieParser());
router.use(session({
  httpOnly: true,	//자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
  secure: false,	//https 환경에서만 session 정보를 주고받도록처리
  secret: 'secret',	//암호화하는 데 쓰일 키
  resave: false,	//세션을 언제나 저장할지 설정함
  saveUninitialized: true,	//세션이 저장되기 전 uninitialized 상태로 미리 만들어 저장
  cookie: {	//세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
    httpOnly: true,
    Secure: true
  }
}));


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
          msg: err,
          loginSuccess : false
        });
      }

      if (!result.length) {
        return res.json({
          msg: '아이디와 패스워드가 틀렸습니다.',
          loginSuccess : false
        });
        
      }

      //암호화된 비밀번호를 바로 복호화시킬순 없기때문에
      //원래의 비밀번호를 암호화시킨후 맞는지 확인해야한다.
      bcrypt.compare(password, result[0]['password'], (bErr, bResult) => {
          // wrong password
          if (bErr) {
            return res.json({
              msg: "패스워드가 틀렸습니다.",
              loginSuccess : false
            });
          }
          //아이디와 패스워드가 같아서 결과값이 나왔다면
          //토큰생성
          if (bResult) {
            const token = jwt.sign( {token : result[0].id},
              'SECRETKEY', { expiresIn:'7d' });//만료기간(임의설정)

            //토큰을 저장한다. where ? 쿠키 or 로컬스토리지
            //쿠키에 저장할 것-> cookie-parser 라이브러리 설치
            // res.cookie("x_auth", token,  {
            //   httpOnly: false,
            //   sameSite: "None" //cookie의 옵션 중 하나인 sameSite의 값이 디폴트로 lax에 지정되는 문제가 발생한다. (크롬의 경우)
            //                    //그래서 POST API를 사용할 수 없고 GET API만이 허용된다
            // });
            //req.session.id  = result[0].id;

            return res.json({
               msg: '로그인 성공',
               token,
               user : result[0],
               loginSuccess : true
            });
          }
          return res.json({
            msg: '아이디나 패스워드가 틀렸습니다.',
            loginSuccess : false
          });
        }
      );
    }
  );
});


//router.get('/auth', userMiddleware.isLoggedIn, (req, res, next) => {
router.get('/auth', (req, res, next) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 true 라는 말
    //console.log(req.session.id)
    if(req.session.id){
      return  res.json({
        //id : req.user.id,
        isAdmin : false,
        //isAdmin : req.user.role === 0 ? false : true, // role 0 -> 일반유저, 0이 아니면 관리자
        isAuth : true,
        //username : req.user.username,
        //role : req.user.role
      })
    } 
    else {
      return res.json({
        status: "FAILED",
        msg: '접근권한이 없습니다.'
      });

    }
});


module.exports = router;