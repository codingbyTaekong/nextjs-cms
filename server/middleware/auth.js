const jwt = require('jsonwebtoken')
const db_config = require("../db_config");
const conn = db_config.init();
exports.accessTokenMiddleware = (req, res, next) => {
    // read the token from header or url 
    const token = req.headers["authorization"] || req.body.token

    // token does not exist
    if(!token) {
        return res.status(403).json({
            callback : 404,
            message: 'not logged in'
        })
    }

    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        res.status(403).send({
            callback : 404,
            message: error.message
        })
    }

    // process the promise
    p.then((decoded)=>{
        console.log(decoded);
        req.decoded = decoded
        next()
    }).catch(onError)
}


exports.refreshTokenMiddleware = (req, res, next) => {
    const token_key = req.body.token

    // token does not exist
    if(!token_key) {
        return res.status(403).send({
            callback : 403,
            message: 'not logged in'
        })
    }

    const select_sql = `
        select * from user_table where token_key = '${token_key}'
    `;
    conn.query(select_sql, async (err, rows) => {
        if (err) {
        console.log(err);
        return res.status(500).send({ callback: 500, message: err });
        }
        if (rows.length === 0) {
        return res.status(403).send({ callback: 403, message: "잘못된 토큰입니다." });
        }
        const token = rows[0].token

        // create a promise that decodes the token
        const p = new Promise(
            (resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                    if(err) reject(err)
                    resolve(decoded)
                })
            }
        )
    
        // if it has failed to verify, it will return an error message
        const onError = (error) => {
            res.status(403).json({
                success: false,
                message: error.message
            })
        }
    
        // process the promise
        p.then((decoded)=>{
            next(decoded)
        }).catch(onError)
    })



}