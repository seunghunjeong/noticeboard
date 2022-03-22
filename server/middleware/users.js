const jwt = require("jsonwebtoken");

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

    next();
  },
  
  isLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        'SECRETKEY'
      );
      req.userData = decoded;
      next();
    } catch (err) {
      return res.status(401).send({
        msg: 'Your session is not valid!'
      });
    }
  }
};