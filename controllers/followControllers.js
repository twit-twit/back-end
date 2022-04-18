const { Follows } = require("../models")
const { Users } = require("../models")

exports.getMyFollows = (req, res) => {
    const { userCode } = req.query;

    try {
        const myFollows = await Follows.findAll({
            include: [{
                model: Users,
                as: userCode,
                attributes: ['userId']
            }]
        })
        res.status(200).json({
            result: 'SUCCESS',
            code: 0,
            message:'팔로우 조회 성공',
            myFollows
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            result: 'FAIL',
            code: -5,
            message: "팔로우 조회 실패"
        })
    }
}

exports.postMyFollows = (req, res) => {
    const { userCode, followUserCode } = req.body;
    try {
        await Follows.create({
            userCode,
            followUserCode
        })
        res.status(201).json({
            result: 'SUCCESS',
            code: 0,
            message:'팔로우 성공'
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            result: 'FAIL',
            code: -5,
            message: "팔로우 실패"
        })
    }
}

exports.deleteMyFollows = (req, res) => {
    const { userCode, followUserCode } = req.params;
    try {
        await Follows.destroy({
            userCode,
            followUserCode
        })
        res.status(201).json({
            result: 'SUCCESS',
            code: 0,
            message:'팔로우 취소 성공'
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            result: 'FAIL',
            code: -5,
            message: "팔로우 취소 실패"
        })
    }
}