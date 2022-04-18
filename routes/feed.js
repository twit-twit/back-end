const router = require("express").Router()
const feedController = require("../controllers/feedControllers")


router.post("/", feedController.postFeeds)
router.get('/', feedController.getFeeds)
router.delete('/:feedCode', feedController.deleteFeeds)
router.put("/:feedCode", feedController.updateFeeds)

module.exports = router
