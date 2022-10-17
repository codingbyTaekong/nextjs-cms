const router = require('express').Router()
const controller = require('./tour.controller')


router.get('/get_tour', controller.getTourData);

module.exports = router;