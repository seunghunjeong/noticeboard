const jwt = require("jsonwebtoken");
const db = require('../config/db');

module.exports = {
  //회원가입 체크
  validateRegister: (req, res, next) => {
    // username min length 3
    if (!req.body.username || req.body.username.length < 3) {
      return res.json({
        msg: '아이디 3자리이상'
      });
    }

    // password min 4 chars
    if (!req.body.password || req.body.password.length < 4) {
      return res.json({
        msg: '비밀번호 4자리이상'
      });
    }

    // password (repeat) does not match
    if (
      !req.body.comfirmPassword ||
      req.body.password != req.body.comfirmPassword
    ) {
      return res.json({
        msg: '비밀번호 불일치'
      });
    }

    next();  //next()가 없으면 미들웨어에 갇힌다.
  },
  //로그인 권한체크
  isLoggedIn : (req, res, next) => {    

    try {
     
      //token decoded
      const token = req.headers.authorization.split('Bearer ')[1];
      //console.log(token)
      const decoded = jwt.verify(token, 'SECRETKEY');
      //console.log(decoded.token)
      const sqlLogin = 'SELECT * FROM board.users WHERE id = ?'
      
      db.query(sqlLogin, [decoded.token], (err, result) => {
        // 인증실패
        if (err) {
          return res.json({
            status: "FAILED",
            statusCode: err,
            msg: '유효하지않은 토큰.',
            userName : ' ',
            id : ' ',
            isAuth : false
          });
        }
        // 인증성공
        if (!result.length) {
          const userName = result[0].username
          return res.json({
              status: "SUCCESS",
              statusCode: 200,
              userName : userName,
              id : decoded.token
          });
        }
      });
     } catch (err) {
       return res.json({
         status: "토큰에러",
         statusCode: err,
         msg: '접근권한이 없습니다.',
         userName : ' ',
         id : ' ',
         isAuth : false
       });
     }

     next();
   }

   //관리자권한체크만들어야함

};