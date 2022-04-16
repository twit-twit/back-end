const router = require('express').Router();
const controller = require('../controllers/userControllers');

router.get('/', (req, res) => {
    res.status(200).send('API를 구현합시다!');
});

router.post('/users', controller.postLogin);

module.exports = router;