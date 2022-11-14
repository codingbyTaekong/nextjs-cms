const router = require('express').Router()
const controller = require('./auth.controller')
const authMiddleware = require('../../../middleware/auth')

router.post('/auth/login', controller.login);
router.get('/auth/check_id', controller.check_id);
router.get('/auth/check_nickname', controller.check_nickname);
router.post('/auth/register', controller.register);
router.post('/auth/refresh', controller.refreshToken);
router.post('/auth/verify_access_toekn', controller.verify_access_toekn);
module.exports = router