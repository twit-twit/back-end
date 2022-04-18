const router = require('express').Router();
const userController = require('../controllers/userControllers');

router.post('/login', userController.postLogin);

module.exports = router;