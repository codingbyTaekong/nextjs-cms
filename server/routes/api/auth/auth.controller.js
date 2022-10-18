const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db_config = require("../../../db_config");
const dayjs = require("dayjs");
const { accessTokenMiddleware, refreshTokenMiddleware } = require("../../../middleware/auth");
const conn = db_config.init();

exports.login = (req, res) => {
  if (req.body.id && req.body.password) {

    const { body: { id, password } } = req;
    const select_sql = `
        select * from user_table where user_id = '${id}'
    `;
    // id체크
    conn.query(select_sql, async (err, rows) => {
      if (err) {
        return res.send({ callback: 500, err: err });
      }
      if (rows.length === 0) {
        return res.send({ callback: 404, err: "존재하지 않는 아이디입니다." });
      } else {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedTokenKey = bcrypt.hashSync(`${id + password}_bigchoi`, salt);
        nickname = rows[0].user_nickname;
        rule = rows[0].rule;
        // 암호화된 비밀번호
        const encodedPassword = rows[0].user_pwd;
        // console.log(encodedPassword)
        bcrypt.compare(password, encodedPassword, (err, same) => {
          if (err) console.log(err);
          // async callback
          if (same) {
            const accessToken = jwt.sign(
              { id, nickname },
              process.env.JWT_SECRET,
              {
                expiresIn: "15m",
                issuer: "bigchoi",
              }
            );
            const refreshToken = jwt.sign(
              { id },
              process.env.JWT_SECRET,
              {
                expiresIn: "14h",
                issuer: "bigchoi",
              }
            );
            res.cookie('secureCookie', hashedTokenKey, {
              secure: true,
              httpOnly: true,
              expires: dayjs().add(30, "days").toDate()
            })
            return res.send({
              callback : 200,
              token : {
                accessToken,
                refreshToken
              }
            })
          } else {
            res.send({ callback : 403, context: "비밀번호가 다릅니다!" });
          }
        });
      }
    });
  } else {
    accessTokenMiddleware(req, res, () => {
      console.log("완료")
      res.send("oh")
    })
  }
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
    const hashedTokenKey = bcrypt.hashSync(`${id + password}_bigchoi`, salt);
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
      const accessToken = jwt.sign(
        { id, nickname },
        process.env.JWT_SECRET,
        {
          expiresIn: "15m",
          issuer: "bigchoi",
        }
      );
      // ! 수정할 것
      // 프론트로 보내서 로컬스토리지 혹은 헤더에 담아버리자
      // res.cookie("accessToken", accessToken);
      // 리프레쉬토큰은 다시 암호화해서 배출하자
      // res.cookie("refreshToken", refreshToken);
      res.cookie('secureCookie', hashedTokenKey, {
        secure: true,
        httpOnly: true,
        expires: dayjs().add(30, "days").toDate()
      })
      res.send({
        callback: 200, token: {
          accessToken,
          refreshToken
        }
      });
    });
  } catch (error) {
    console.log(error)
  }
}


exports.refreshToken = (req, res) => {
  refreshTokenMiddleware(req, res, () => {
    console.log("ok")
  })
}
