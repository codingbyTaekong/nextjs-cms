const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db_config = require("../../../db_config");
const dayjs = require("dayjs");
const { accessTokenMiddleware, refreshTokenMiddleware } = require("../../../middleware/auth");
const conn = db_config.init();


exports.login = async (req, res) => {
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
        const nickname = rows[0].user_nickname;
        const rule = rows[0].rule;
        const refreshToken = rows[0].token;
        // 암호화된 비밀번호
        const encodedPassword = rows[0].user_pwd;
        // console.log(encodedPassword)
        bcrypt.compare(password, encodedPassword, async (err, same) => {
          if (err) console.log(err);
          // async callback
          if (same) {
            const accessToken = jwt.sign(
              { id, nickname, rule },
              process.env.JWT_SECRET,
              {
                expiresIn: "1d",
                issuer: "bigchoi",
              }
            );
            jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
              if(err) {
                // 리프레쉬 토큰이 만료되었다면 업데이트 로직
                const new_refreshToken = jwt.sign(
                  { id },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "30d",
                    issuer: "bigchoi",
                  }
                  );
                  const update_sql = `update user_table set updated_at=NOW(), token='${new_refreshToken}' where user_id='${id}'`
                  await conn.promise().query(update_sql);
                  res.cookie('secureCookie', new_refreshToken, {
                    secure: true,
                    httpOnly: true,
                    expires: dayjs().add(30, "days").toDate()
                  })
                  return res.send({
                    callback : 200,
                    user : {
                      id,
                      nickname,
                      rule
                    },
                    token : {
                      accessToken,
                      refreshToken
                    }
                  })
              }
              // 리프레쉬 토큰이 만료되지않았다면 로직
              const update_sql = `update user_table set updated_at=NOW() where user_id='${id}'`
              await conn.promise().query(update_sql);
              res.cookie('secureCookie', refreshToken, {
                secure: true,
                httpOnly: true,
                expires: dayjs().add(30, "days").toDate()
              })
              return res.send({
                callback : 200,
                user : {
                  id,
                  nickname,
                  rule
                },
                token : {
                  accessToken,
                  refreshToken
                }
              })
            })
          } else {
            res.send({ callback : 403, context: "비밀번호가 다릅니다!" });
          }
        });
      }
    });
  } else {
    res.status(403).send({callback : 403, context : "아이디 혹은 비밀번호가 없습니다."})
  }
  //  else {
    
  //   refreshTokenMiddleware(req, res, (decoded) => {
  //     const {id, nickname, rule} = decoded
  //     const accessToken = jwt.sign(
  //       { id, nickname, rule },
  //       process.env.JWT_SECRET,
  //       {
  //         expiresIn: "15m",
  //         issuer: "bigchoi",
  //       }
  //     );
  //     res.send({
  //       callback : 200,
  //       user : {
  //         id,
  //         nickname,
  //         rule
  //       },
  //       token : {
  //         accessToken,
  //       }
  //     })
  //   })
  // }
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
    const refreshToken = jwt.sign({ id, nickname, rule : 1 }, process.env.JWT_SECRET, {
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
        { id, nickname, rule : 1},
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
        callback: 200, 
        user : {
          id,
          nickname
        },
        token: {
          accessToken,
          hashedTokenKey
        }
      });
    });
  } catch (error) {
    console.log(error)
  }
}


exports.refreshToken = async (req, res) => {
  refreshTokenMiddleware(req, res, async (decoded) => {
    const user_id = decoded.id;
    const select_sql = `select * from user_table where user_id = '${user_id}'`

    const [user_row] = await conn.promise().query(select_sql);
    const {user_nickname ,rule} = user_row[0];
    const accessToken = jwt.sign(
      { user_id, user_nickname, rule },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
        issuer: "bigchoi",
      }
    );

    return res.status(200).send({
      callback : 200,
      user : {
        id : user_id,
        nickname : user_nickname,
        rule: rule
      },
      token : accessToken
    })
  })
}


exports.verify_access_toekn = async (req, res) => {
  accessTokenMiddleware(req, res, async (decoded)=> {
    console.log(decoded);
    res.send('ok')
  })
}