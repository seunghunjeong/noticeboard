const express = require('express');
const router = express.Router();
const cors = require('cors');

const db = require('../config/db');
//const userMiddleware = require('../middleware/users.js');

const cookieParser = require("cookie-parser");
router.use(cookieParser());
var session = require("express-session"); 

var corsOptions = {
  origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
};
router.use(cors(corsOptions))
router.use(session({ 
  //key : "isLogin",
  secret : "secret", 
  resave : false, 
  saveUninitialized : false,
  cookie : {
    expires : 60*60*24
  } 
}))
/* option - secret : 필수, 세션 암호화에 사용 
- resave : 세션이 변경되지 않아도 저장이 됨, false 권장 
- saveUninitialized : 세션 초기화시 미리 만들지를 설정 
*/
router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    //"x-access-token, Origin, Content-Type, Accept"
    "http://localhost:3000"
  );
  next();
});

// 비밀번호 암호화
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
const saltRounds = 10; //암호화를 몇 번시킬지 정하는 숫자


//회원가입 신청
router.post('/standby-signup', (req, res, next) => {

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
              msg: "이미 사용하고 있는 아이디입니다.",
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

//회원가입신청 목록 불러오기
router.get("/getStandby_signup", (req, res) => {
    
  const sqlQuery = `SELECT * FROM board.users WHERE status  = 'N'`;

  db.query(sqlQuery, (err, result) => {
      res.send(result);
  });

})

//회원가입 승인
router.post('/approve-sign-up', (req, res, next) => {

  const id = req.body.id;
  const sqlQuery = "UPDATE board.users SET status = 'Y' WHERE id = ?"
  
  db.query(sqlQuery, [id], (err, result) => {
      if (err) {
        //throw err;
        return res.json({
          msg: "가입승인오류.",
        })
      }
      return res.json({
        msg : "success"
      });
    }
  );
});

//로그인
router.post('/login', (req, res, next) => {

  const id = req.body.id;
  const password = req.body.password;
  const sqlLogin = 'SELECT * FROM board.users WHERE BINARY(id) = ?'
  
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
            // jwt
            // const token = jwt.sign( {token : result[0].id},
            //   'SECRETKEY', { expiresIn : '86400' });//만료기간24 hours

            //토큰을 저장한다. where ? 쿠키 or 로컬스토리지
            //쿠키에 저장할 것-> cookie-parser 라이브러리 설치
            // res.cookie("test", "test");
            // res.cookie("accessToken", token, {
            //   maxAge: 10000, 
            //   expires  : new Date(Date.now() + 9999999), 
            //   httpOnly :false
            // });
            // 로그인 후 사용자 정보를 세션에 저장 
            // req.session.isLogin = result[0].id
            // req.session.userName = result[0].username
            // req.session.save(error => {
            //   if(error) console.log(error)
            // })
               
            return res.json({
               msg: '로그인 성공',
               //accessToken: token,
               userId : result[0].id,
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


//페이지로딩시 로그인 유무 권한 체크
router.post('/auth', (req, res, next) => {
  
  const userId = req.body.userId;
  const sqlLogin = 'SELECT * FROM board.users WHERE id = ?'
  console.log(userId)

  db.query(sqlLogin, [userId], (err, result) => {
    // 인증실패
    if (err) {
      return res.json({
        userName : null,
        id : null,
        isAuth : false,
        admin : false
      });
    }
    // 인증실패
    if (!result.length) {
      return res.json({
        userName : null,
        id : null,
        isAuth : false,
        admin : false
      });
    }
    // 인증성공
    else {
      return res.json({
        userName : result[0].username,
        id : result[0].id,
        isAuth : true,
        admin : result[0].auth === 1 ? true : false
    });
    }
  });
 
})

//로그아웃
router.get('/logout', (req, res) => {
  
  try{   
    return res.json({  
      isAuth : false ,
      id : ' ',
      userName : ' ',
      logoutSuccess : true
    })
  }
  catch(err) {
    res.json({ logoutSuccess : err})
  }
})

module.exports = router;