const router = require('express').Router();
const commentController = require("../controllers/commentControllers")
const authMiddleware = require('../middlewares/users/auth-middleware');

router.get('/', authMiddleware, commentController.getComments);
// router.post('/', authMiddleware, commentController.posts);
// router.delete('/', authMiddleware, commentController.deletes);
// router.get('/followers', authMiddleware, commentController.gets);

module.exports = router;