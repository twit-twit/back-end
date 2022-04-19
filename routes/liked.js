const router = require("express").Router()
const feedController = require("../controllers/feedControllers")

router.post('/', feedController.likedFeed)

module.exports = router;

