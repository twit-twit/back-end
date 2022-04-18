const router = require('express').Router();
const followController = require("../controllers/followControllers")
const authMiddleware = require('../middlewares/users/auth-middleware');

router.get('/', authMiddleware, followController.getMyFollows);
router.post('/', authMiddleware, followController.postMyFollows);
router.delete('/', authMiddleware, followController.deleteMyFollows);

module.exports = router;