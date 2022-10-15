const router = require('express').Router()
const controller = require('./auth.controller')
const authMiddleware = require('../../../middleware/auth')

router.post('/auth/login', controller.login);
router.get('/auth/check_id', controller.check_id);
router.get('/auth/check_nickname', controller.check_nickname);
router.post('/auth/register', controller.register);
router.get('/test', controller.test);
module.exports = router