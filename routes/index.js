const router = require('express').Router();

const userRouter = require('./users');
const feedRouter = require("./feed")
const followRouter = require("./follow")

router.use('/users', userRouter);
router.use("/feed", feedRouter)
router.use("/friendships", followRouter)



module.exports = router;