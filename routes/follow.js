const router = require('express').Router();
const controller = require('../controllers/feedControllers');

router.get('/friendships', followController.getMyFollows);
router.post('/friendships', followController.postMyFollows);
router.delete('/friendships', followController.deleteMyFollows);

module.exports = router;