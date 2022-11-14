const jwt = require('jsonwebtoken')
const db_config = require("../db_config");
const conn = db_config.init();
exports.accessTokenMiddleware = async (req, res, next) => {
    // read the token from header or url 
    let token = req.headers["authorization"]
    console.log(token);
    // token does not exist
    if(!token) {
        return res.status(403).json({
            callback : 404,
            message: '토큰이 없습니다.'
        })
    }
    token = token.split(' ')[1];
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
        console.log("여기서 에러가 나나?")
        console.log(error);
        this.refreshTokenMiddleware(req, res, next)
    }

    // process the promise
    p.then((decoded)=>{
        console.log(decoded);
        req.decoded = decoded
        next()
    }).catch(onError)
}


exports.refreshTokenMiddleware = (req, res, next) => {
    const refreshToken = req.cookies.secureCookie
    // token does not exist
    if(!refreshToken) {
        return res.status(403).send({
            callback : 403,
            message: 'not logged in'
        })
    }
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
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
}