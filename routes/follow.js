const router = require('express').Router();
const followController = require("../controllers/followControllers")

router.get('/', followController.getMyFollows);
router.post('/', followController.postMyFollows);
router.delete('/', followController.deleteMyFollows);

module.exports = router;