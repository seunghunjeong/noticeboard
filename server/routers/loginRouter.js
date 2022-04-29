const router = require('express').Router();
const db = require('../config/db');

// logger
const logger = require('../logger');

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
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, (err, hash) => {
      db.query(sqlQuery, [id, username, hash], (err, result) => {
        if (err) {
          logger.error(err);
          //throw err;
          return res.json({
            msg: "해당 아이디를 사용할 수 없습니다.",
          })
        }
        return res.json({
          msg: "success"
        });
      });
    });
  });
});

//회원가입신청 목록 불러오기
router.get("/getStandby_signup", (req, res) => {

  //const sqlQuery = `SELECT * FROM board.users WHERE status  = 'N'`;
  const sqlQuery = `
    SELECT 
	   id,
	   username,
	   registered,
	   status,
	   approved,
	   auth,
	   department,
	   position
    FROM
     board.users
    ORDER BY 
     registered DESC, status ASC
  `;

  db.query(sqlQuery, (err, result) => {
    if (err) {
      logger.error(err);
    }
    res.send(result);
  });

})

//회원가입 승인
router.post('/approve-sign-up', (req, res, next) => {

  const id = req.body.id;
  const sqlQuery = "UPDATE board.users SET status = 'Y', approved = CURRENT_TIMESTAMP WHERE id = ?"

  db.query(sqlQuery, [id], (err, result) => {
    if (err) {
      //throw err;
      logger.error(err);
      return res.json({
        msg: "가입승인오류. 관리자에게 문의해주세요.",
      })
    }
    return res.json({
      msg: "success"
    });
  }
  );
});

//회원가입 거절
router.post('/reject-sign-up', (req, res, next) => {

  const id = req.body.id;
  const sqlQuery = "DELETE FROM board.users WHERE id = ?"

  db.query(sqlQuery, [id], (err, result) => {
    if (err) {
      //throw err;
      logger.error(err);
      return res.json({
        msg: "가입거절오류. 관리자에게 문의해주세요.",
      })
    }
    return res.json({
      msg: "success"
    });
  }
  );
});

//관리자 지정
router.post('/admin-appoint', (req, res, next) => {

  const id = req.body.id;
  const sqlQuery = "UPDATE board.users SET auth = 1 WHERE id = ?"

  db.query(sqlQuery, [id], (err, result) => {
    if (err) {
      //throw err;
      logger.error(err);
      return res.json({
        msg: "관리자 지정 오류. 관리자에게 문의해주세요.",
      })
    }
    return res.json({
      msg: "success"
    });
  }
  );
});

//관리자 해지
router.post('/admin-remove', (req, res, next) => {

  const id = req.body.id;
  const sqlQuery = "UPDATE board.users SET auth = null WHERE id = ?"

  db.query(sqlQuery, [id], (err, result) => {
    if (err) {
      //throw err;
      logger.error(err);
      return res.json({
        msg: "관리자 해지 오류. 관리자에게 문의해주세요.",
      })
    }
    return res.json({
      msg: "success"
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
    // 유저 확인 x
    if (err) {
      logger.error(err);
      return res.json({
        msg: err,
        loginSuccess: false
      });
    }

    if (!result.length) {
      return res.json({
        msg: '아이디가 존재하지않습니다.',
        loginSuccess: false
      });

    }
    // 유저 확인 o
    if (result[0].status === "N") {
      return res.json({
        msg: '가입승인 대기중입니다.',
        loginSuccess: false
      });
    }
    else {
      //암호화된 비밀번호를 바로 복호화시킬순 없기때문에
      //원래의 비밀번호를 암호화시킨후 맞는지 확인해야한다.
      bcrypt.compare(password, result[0]['password'], (bErr, bResult) => {
        // wrong password
        if (bErr) {
          logger.error(bErr);
          return res.json({
            msg: "패스워드가 틀렸습니다.",
            loginSuccess: false
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
            userId: result[0].id,
            loginSuccess: true
          });
        }
        logger.error(err);
        return res.json({
          msg: '아이디나 패스워드가 틀렸습니다.',
          loginSuccess: false
        });
      }
      );
    }
  }
  );
});


//페이지로딩시 로그인 유무 권한 체크
router.post('/auth', (req, res, next) => {

  const userId = req.body.userId;
  const sqlLogin = 'SELECT * FROM board.users WHERE id = ? AND status = "Y"'

  db.query(sqlLogin, [userId], (err, result) => {
    // 인증실패
    if (err) {
      logger.error(err);
      return res.json({
        userName: null,
        id: null,
        isAuth: false,
        admin: false,
        department : null,
        position : null
      });
    }
    // 인증실패
    if (!result.length) {
      return res.json({
        userName: null,
        id: null,
        isAuth: false,
        admin: false,
        department : null,
        position : null
      });
    }
    // 인증성공
    else {
      return res.json({
        userName: result[0].username,
        id: result[0].id,
        isAuth: true,
        admin: result[0].auth === 1 ? true : false,
        department : result[0].department,
        position : result[0].position
      });
    }
  });

})

//로그아웃
router.get('/logout', (req, res) => {

  try {
    return res.json({
      isAuth: false,
      id: null,
      userName: null,
      admin: false,
      department : null,
      position : null,
      logoutSuccess: true
    })
  }
  catch (err) {
    logger.error(err);
    res.json({ logoutSuccess: err })
  }
})

//로그인 권한체크 사용안함
// isLoggedIn : (req, res, next) => {    

//   try {

//     //token decoded
//     const token = req.headers.authorization.split('Bearer ')[1];
//     //console.log(token)
//     const decoded = jwt.verify(token, 'SECRETKEY');
//     //console.log(decoded.token)
//     const sqlLogin = 'SELECT * FROM board.users WHERE id = ?'

//     db.query(sqlLogin, [decoded.token], (err, result) => {
//       // 인증실패
//       if (err) {
//         return res.json({
//           status: "FAILED",
//           statusCode: err,
//           msg: '유효하지않은 토큰.',
//           userName : ' ',
//           id : ' ',
//           isAuth : false
//         });
//       }
//       // 인증성공
//       if (!result.length) {
//         const userName = result[0].username
//         return res.json({
//             status: "SUCCESS",
//             statusCode: 200,
//             userName : userName,
//             id : decoded.token
//         });
//       }
//     });
//    } catch (err) {
//      return res.json({
//        status: "토큰에러",
//        statusCode: err,
//        msg: '접근권한이 없습니다.',
//        userName : ' ',
//        id : ' ',
//        isAuth : false
//      });
//    }

module.exports = router;