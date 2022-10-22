const router = require('express').Router()
const controller = require('./gym.controller')


router.get('/get_gym', controller.getGymData);
router.get('/recent_reviews', controller.recentReviewGyms);

module.exports = router;