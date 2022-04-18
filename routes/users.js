const router = require('express').Router();
const userController = require('../controllers/userControllers');

router.post('/login', userController.postLogin);
router.get('/dup', userController.getDuplicateUserId);

module.exports = router;