const { Feeds } = require("../models")
const { Users } = require("../models")


//게시글 조회
exports.getFeeds = async (req, res) => {
    /*========================================================================================================
#swagger.tags = ['Feeds']
#swagger.summary = '게시글 조회 API'
#swagger.description = '게시글 조회 API'
========================================================================================================*/
    const { feedType, userCode } = req.query;

    try {
        if (feedType === 'all') {
            const feedArr = await Feeds.findAll({})
            let result = feedArr.sort((a, b) => b.createdAt - a.createdAt)
            res.status(200).json({ result: "SUCCESS", code: 0, result });

        } else if (feedType === "user") {
            const user = await Users.findOne({ where: { userCode: userCode } })
            const feeds = await user.getFeeds();
            /*=====================================================================================
             #swagger.responses[200] = {
              description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
              schema: { "result": "SUCCESS", 'code': 0, 'message': '정상', }
          }
          =====================================================================================*/
            res.status(200).json({
                result: "SUCCESS",
                code: 0,
                feeds
            })

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
    /*========================================================================================================
#swagger.tags = ['Feeds']
#swagger.summary = '게시글 작성 API'
#swagger.description = '게시글 작성 API'
========================================================================================================*/

    const { userCode, content, feedUrl } = req.body;
    console.log("게시글 작성", content)
    if (content === "" || content === null) {
        return res.status(400).json({
            result: "FAIL",
            code: -4,
            message: "내용은 반드시 입력해주세요!"
        })
    }


    try {
        if (!req.file) {
            await Feeds.create({
                userCode,
                content,
                feedUrl,
                feedImage: ''
            })
            res.status(201).json({
                result: 'SUCCESS',
                code: 0,
                message: "게시글 작성 완료!"
            })
        } else {
            await Feeds.create({
                userCode,
                content,
                feedUrl,
                feedImage: '/image/' + req.file.filename
            })
            /*=====================================================================================
                      #swagger.responses[200] = {
                    description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
                    schema: { "result": "SUCCESS", 'code': 0, 'message': '정상', }
                }
                =====================================================================================*/
            res.status(201).json({
                result: 'SUCCESS',
                code: 0,
                message: "게시글 작성 완료!"
            })
        }

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
    /*========================================================================================================
#swagger.tags = ['Feeds']
#swagger.summary = '게시글 삭제 API'
#swagger.description = '게시글 삭제 API'
========================================================================================================*/
    const { feedCode } = req.query;


    try {
        await Feeds.destroy({ where: { feedCode: feedCode } })
        /*=====================================================================================
              #swagger.responses[200] = {
            description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "SUCCESS", 'code': 0, 'message': '정상', }
        }
        =====================================================================================*/
        res.status(200).json({
            result: "SUCCESS",
            code: 0,
            message: "게시글 삭제완료!"
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({
            result: "FAIL",
            code: 4,
            message: "게시글 삭제 실패!"
        })
    }
}


//게시글 수정
exports.updateFeeds = async (req, res) => {
    /*========================================================================================================
#swagger.tags = ['Feeds']
#swagger.summary = '게시글 수정 API'
#swagger.description = '게시글 수정 API'
========================================================================================================*/
    const { feedCode, userCode, content, feedUrl } = req.body;

    let userFeed = await Feeds.findAll({ where: { feedCode } }).then((user) => {
        return user[0].userCode
    })
    console.log("유저코드", typeof (userCode))
    console.log("유저피드", typeof (userFeed))
    if (Number(userCode) === userFeed) {
        try {
            if (!req.file) {
                await Feeds.update({ content, feedUrl, feedImage: "" }, { where: { feedCode: feedCode } })
                res.status(200).json({
                    result: "SUCCESS",
                    code: 0,
                    message: "게시글 수정 완료!"
                })
            } else {
                const feedImage = '/image/' + req.file.filename
                await Feeds.update({ content, feedUrl, feedImage }, { where: { feedCode: feedCode } })
                /*=====================================================================================
                    #swagger.responses[200] = {
                  description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
                  schema: { "result": "SUCCESS", 'code': 0, 'message': '정상', }
              }
              =====================================================================================*/
                res.status(200).json({
                    result: "SUCCESS",
                    code: 0,
                    message: "게시글 수정 완료!"
                })
            }
        } catch (err) {
            console.log(err)
            res.status(400).json({
                result: "FAIL",
                code: -4,
                message: "게시글 수정 실패!"
            })
        }
    } else {
        return res.status(400).json({
            result: "FAIL",
            code: -4,
            message: "작성한 사용자가 아니라 수정할 수 없습니다."
        })
    }

}