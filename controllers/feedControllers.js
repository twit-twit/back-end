const { Feeds } = require("../models")
const { Users } = require("../models")
const { Op } = require("sequelize")

//게시글 조회
exports.getFeeds = async (req, res) => {
    const { feedType } = req.query;
    const userCode = 1;

    // include: [
    //     { model: Users, as: "users", attributes: ['userId'] }
    // ]
    try {
        if (feedType === 'all') {
            const feedArr = await Feeds.findAll({})
            let result = feedArr.sort((a, b) => b.createdAt - a.createdAt)
            res.status(200).json({ result: "SUCCESS", code: 0, result });

        } else if (feedType === "user") {
            const user = await Users.findOne({ where: { userCode: userCode } })
            console.log("@@@@@", user)
            const feeds = await user.getFeeds();
            console.log("@$$$$$$$", feeds)

            // await Feeds.findAll({
            //     where: {
            //         userCode: userCode
            //     },
            //     include: [{
            //         model: Users,
            //     }]
            // })

        }

    } catch (err) {
        console.log(err)
        res.status(400).json({
            result: 'FAIL',
            code: -4,
            message: "게시글 조회 실패!"
        })
    }
}

//게시글 작성
exports.postFeeds = async (req, res) => {
    const { userCode, content } = req.body;
    try {
        await Feeds.create({
            userCode,
            title,
            content,
        })
        res.status(201).json({
            result: 'SUCCESS',
            code: 0,
            message: "게시글 작성 완료!"
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            result: 'FAIL',
            code: -4,
            message: "게시글 작성 실패!"
        })
    }


}


//게시글 삭제
exports.deleteFeeds = async (req, res) => {
    const { feedCode } = req.params;

    try {
        await Feeds.destroy({ where: { feedCode: feedCode } })
        res.status(200).json({
            result: "SUCCESS",
            code: 0,
            message: "게시글 삭제완료!"
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({
            esult: "FAIL",
            code: 4,
            message: "게시글 삭제 실패!"
        })
    }
}


//게시글 수정
exports.updateFeeds = async (req, res) => {
    const { feedCode } = req.params;
    const { title, content } = req.body;


    try {
        await Feeds.update({ title, content }, { where: { feedCode: feedCode } })
        res.status(200).json({
            result: "SUCCESS",
            code: 0,
            message: "게시글 수정 완료!"
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            result: "FAIL",
            code: -4,
            message: "게시글 수정 실패!"
        })
    }
}