const router = require('express').Router();

// Controller
const userController = require('../controllers/userControllers');

router.post('/', userController.postSignUp)
router.post('/login', userController.postLogin);
router.get('/dup', userController.getDuplicateUserId);

module.exports = router;