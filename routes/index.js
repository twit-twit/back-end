const router = require('express').Router();

const userRouter = require('./users');
const feedRouter = require("./feed")
const followRouter = require("./follow")
const likedRouter = require("./liked")

router.use('/users', userRouter);
router.use("/feed", feedRouter)
router.use("/friendships", followRouter)
router.use("/liked", likedRouter)



module.exports = router;