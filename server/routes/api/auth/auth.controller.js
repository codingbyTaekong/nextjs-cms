const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db_config = require("../../../db_config");
const dayjs = require("dayjs");
const authMiddleware = require("../../../middleware/auth");
const conn = db_config.init();

exports.login = (req, res) => {
  authMiddleware(req, res, ()=> {
    console.log("완료")
    res.send("oh")
  })
  // const {
  //   body: { id, pwd },
  // } = req;

  // let nickname;
  // let rule;
  // let authHeader = req.headers["authorization"];
  // if (authHeader) {
  //   console.log("헤더에 있는 정보::: ",authHeader);
  // }

  // const select_sql = `
  //       select * from user_table where user_id = '${id}'
  //   `;
  // // id체크
  // conn.query(select_sql, async (err, rows) => {
  //   if (err) {
  //     console.log(err);
  //     return res.send({ callback: 500, err: err });
  //   }
  //   if (rows.length === 0) {
  //     return res.send({ callback: 404, err: "존재하지 않는 아이디입니다." });
  //   } else {
  //     nickname = rows[0].user_nickname;
  //     rule = rows[0].rule;
  //     // 암호화된 비밀번호
  //     const encodedPassword = rows[0].user_pwd;
  //     // console.log(encodedPassword)
  //     bcrypt.compare(pwd, encodedPassword, (err, same) => {
  //       if (err) console.log(err);
  //       // async callback
  //       if (same) {
  //         // 기존에 로그인한 계정인지
  //         console.log(" 쿠키:::::",req.cookies.refreshToken);
  //         if (req.cookies.refreshToken) {
  //           console.log("토큰있음");
  //           // 토큰있으면 db에 있는 토큰과 비교 후 같으면 access토큰 발금
  //           if (rows[0].token === req.cookies.refreshToken) {
  //             //accessToken 발행
  //             const accessToken = jwt.sign(
  //               { id, nickname },
  //               process.env.JWT_SECRET,
  //               {
  //                 expiresIn: "1h",
  //                 issuer: "bigchoi",
  //               }
  //             );
  //             console.log(`엑세스 토큰 :::::${accessToken}`);
  //             return res.send({ accessToken: accessToken, rule: rule });
  //           } else {
  //             // 잘못된 접근
  //           }
  //         } else {
  //           console.log("토큰 없음");
  //           // 토큰이 없으면 refreshToken 생성
  //           const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {
  //             expiresIn: "14d",
  //             issuer: "bigchoi",
  //           });
  //           const update_sql = `
  //                 update user_table set token='${refreshToken}' where user_id='${id}'
  //               `;
  //           conn.query(update_sql, (err, rows) => {
  //             if (err) {
  //               console.log("에러발생");
  //               return res.send({ callback: 500, err: err });
  //             }
  //             // 업데이트하고 난 뒤에 엑세스 토큰 발급 후 쿠키 등록하고 엑세스토큰 리턴
  //             const accessToken = jwt.sign(
  //               { id, nickname },
  //               process.env.JWT_SECRET,
  //               {
  //                 expiresIn: "1h",
  //                 issuer: "bigchoi",
  //               }
  //             );
  //             console.log(`리프레쉬 토큰 :::::${refreshToken}`);
  //             console.log(`엑세스 토큰 :::::${accessToken}`);
  //             res.cookie("refreshToken", refreshToken);

  //             res.send({ accessToken: accessToken, rule: rule });
  //           });
  //         }
  //       } else {
  //         res.send({ msg: "비밀번호가 다릅니다!" });
  //       }
  //     });
  //   }
  // });
};

exports.check_id = (req, res) => {
  const {
    query: { id }
  } = req;
  const select_sql = `
    select * from user_table where user_id = '${id}'
  `;
  conn.query(select_sql, async (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ callback: 500, err: err });
    }
    if (rows.length === 0) {
      return res.send({ callback: 200, context: "사용가능한 아이디입니다." });
    } else {
      return res.send({ callback: 403, context: "이미 사용 중인 아이디입니다." });
    }
  })
}

exports.check_nickname = (req, res) => {
  const {
    query: { nickname }
  } = req;
  const select_sql = `
    select * from user_table where user_nickname = '${nickname}'
  `;
  conn.query(select_sql, async (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ callback: 500, err: err });
    }
    if (rows.length === 0) {
      return res.send({ callback: 200, context: "사용가능한 닉네임입니다." });
    } else {
      return res.send({ callback: 403, context: "이미 사용 중인 닉네임입니다." });
    }
  })
}
// register 컨트롤러 추가해야함
exports.register = async (req, res) => {
  const {
    body: { id, password, nickname },
  } = req;

  try {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const hashedTokenKey = bcrypt.hashSync(`${id+password}_bigchoi`, salt);
    console.log(process.env.JWT_SECRET)
    const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {
      expiresIn: "14d",
      issuer: "bigchoi",
    });
    
    const insert_sql = `
      insert into user_table set
          user_id = '${id}',
          user_pwd = '${hashedPassword}',
          user_nickname = '${nickname}',
          token = '${refreshToken}',
          token_key = '${hashedTokenKey}',
          created_at = NOW(),
          updated_at = NOW(),
          rule = 1
    `;
    conn.query(insert_sql, (err, rows) => {
      if (err) {
        console.log(err);
        res.send({ callback: 500, err: err });
        return;
      }
      //accessToken 발행
      console.log(rows.insertId);
      const accessToken = jwt.sign(
        { id, nickname },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
          issuer: "bigchoi",
        }
      );
      // ! 수정할 것
      // 프론트로 보내서 로컬스토리지 혹은 헤더에 담아버리자
      // res.cookie("accessToken", accessToken);
      // 리프레쉬토큰은 다시 암호화해서 배출하자
      // res.cookie("refreshToken", refreshToken);
      res.cookie('secureCookie', hashedTokenKey, {
        secure : true,
        httpOnly : true,
        expires : dayjs().add(30, "days").toDate()
      })
      res.send({callback : 200, token : {
        accessToken,
        refreshToken
      }});
    });
  } catch (error) {
    console.log(error)
  }
}


exports.test = (req, res) => {
  console.log(req.headers);
  res.send("ok")
}
