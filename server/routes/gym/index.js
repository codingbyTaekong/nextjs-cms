const router = require('express').Router()
const { upload } = require('../../middleware/multer');
const controller = require('./gym.controller')


router.get('/get_gym', controller.getGymData);
router.get('/recent_reviews', controller.recentReviewGyms);
router.get('/get_gym_text_reviews', controller.getGymTextReviews);
module.exports = router;