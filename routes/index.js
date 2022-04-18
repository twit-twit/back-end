const router = require('express').Router();

const userRouter = require('./users');
const feedRouter = require("./feed")

router.use('/users', userRouter);
router.use("/feed", feedRouter)




module.exports = router;