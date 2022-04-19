const { Feeds, Users, Liked } = require("../models")
const { Op } = require('sequelize');
const { displayedAt } = require("../helpers/displayTime");

//게시글 조회
exports.getFeeds = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['Feeds']
    #swagger.summary = '게시글 조회 API'
    #swagger.description = '게시글 조회 API'
    ========================================================================================================*/

    if (!req.query.feedType || req.query.feedType === "") {

        /*=====================================================================================
        #swagger.responses[400] = {
        description: '필수로 받아야할 입력값(feedType)이 들어오지 않았습니다.',
        schema: { "result": "FAIL", 'code': -10, 'message': '필수 입력값 조회 실패', }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: "Fail",
            code: -10,
            message: '필수 입력값 조회 실패'
        })
    }
    const { feedType, userCode } = req.query;

    try {
        if (feedType === 'all') {
            let feedArr = await Feeds.findAll({})

            let results = feedArr.sort((a, b) => b.createdAt - a.createdAt)
            for (let i = 0; i < results.length; i++) {
                let feedCreatedAt = results[i].createdAt
                let feedUpdatedAt = results[i].updatedAt
                results[i].dataValues.createdAt = displayedAt(feedCreatedAt)
                results[i].dataValues.updatedAt = displayedAt(feedUpdatedAt)
            }
            return res.status(200).json({ result: "SUCCESS", code: 0, results });

        } else if (feedType === "user") {
            const user = await Users.findOne({ where: { userCode: userCode } })
            const feeds = await user.getFeeds();
            let results = feeds.sort((a, b) => b.createdAt - a.createAt)

            for (let i = 0; i < results.length; i++) {
                let userCreatedAt = results[i].createdAt;
                let userUpdatedAt = results[i].updatedAt;
                results[i].dataValues.createdAt = displayedAt(userCreatedAt)
                results[i].dataValues.updatedAt = displayedAt(userUpdatedAt)

            }


            /*  =====================================================================================
                #swagger.responses[200] = {
                description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
                schema: { "result": "SUCCESS", 'code': 0, 'message': '정상', }
                }
                =====================================================================================*/
            return res.status(200).json({
                result: "SUCCESS",
                code: 0,
                results
            })

        }

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            /*=====================================================================================
            #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -4, 'message': "게시글 조회 실패!", }
            }
            =====================================================================================*/
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


    if (!req.body.userCode || req.body.userCode === "") {

        /*=====================================================================================
        #swagger.responses[400] = {
        description: '필수로 받아야할 입력값(userCod)가 들어오지 않았습니다.',
        schema: { "result": "FAIL", 'code': -10, 'message': '필수 입력값 조회 실패', }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: "Fail",
            code: -10,
            message: "필수 입력값 조회 실패"

        })
    }

    const { userCode, content, feedUrl } = req.body;
    console.log("게시글 작성", content)
    if (content === "" || content === null || content === undefined) {
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
            return res.status(201).json({
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
            return res.status(201).json({
                result: 'SUCCESS',
                code: 0,
                message: "게시글 작성 완료!"
            })
        }

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            /*=====================================================================================
            #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -4, 'message': "게시글 작성 실패!", }
            }
            =====================================================================================*/
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
    if (!req.query.feedCode || !req.query.userCode || req.query.feedCode === "" || req.query.userCode === "") {

        /*=====================================================================================
        #swagger.responses[400] = {
        description: '필수로 받아야할 입력값(feedCode,userCod)가 들어오지 않았습니다.',
        schema: { "result": "FAIL", 'code': -10, 'message': '필수 입력값 조회 실패', }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: "Fail",
            code: -10,
            message: "필수 입력값 조회 실패"

        })
    }
    const { feedCode, userCode } = req.query;
    let [userFeed] = await Feeds.findAll({
        where: { feedCode },
        raw: true
    }).then((user) => { return user.map((x) => { return x.userCode }) })


    if (Number(userCode) === userFeed) {
        try {
            await Feeds.destroy({ where: { feedCode: feedCode } })
            /*=====================================================================================
                #swagger.responses[200] = {
                description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
                schema: { "result": "SUCCESS", 'code': 0, 'message': '정상', }
            }
            =====================================================================================*/
            return res.status(200).json({
                result: "SUCCESS",
                code: 0,
                message: "게시글 삭제완료!"
            })

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                /*=====================================================================================
                #swagger.responses[400] = {
                description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
                schema: { "result": "FAIL", 'code': -4, 'message': "게시글 삭제 실패!", }
                } 
                =====================================================================================*/
                result: "FAIL",
                code: 4,
                message: "게시글 삭제 실패!"
            })
        }
    } else {
        return res.status(400).json({
            /*=====================================================================================
                #swagger.responses[400] = {
               description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
               schema: { "result": "FAIL", 'code': -4, 'message': "작성자가 아니라 삭제불가", }
           }
           =====================================================================================*/
            result: "FAIL",
            code: -4,
            message: "작성한 사용자가 아니라 삭제할 수 없습니다."
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
    if (!req.body.feedCode || !req.body.userCode || req.body.feedCode === "" || req.body.userCode === "") {
        /*=====================================================================================
       #swagger.responses[400] = {
       description: '필수로 받아야할 입력값(feedCode,userCode,content)이 들어오지 않았습니다.',
       schema: { "result": "FAIL", 'code': -10, 'message': '필수 입력값 조회 실패', }
       }
       =====================================================================================*/
        return res.status(400).json({
            result: "Fail",
            code: -10,
            message: "필수 입력값 조회 실패"

        })
    }
    const { feedCode, userCode, content, feedUrl } = req.body;

    //게시글 작성자 찾기
    let [userFeed] = await Feeds.findAll({
        where: { feedCode },
        raw: true
    }).then((user) => { return user.map((x) => { return x.userCode }) })


    if (Number(userCode) === userFeed) {
        try {
            if (!req.file) {
                await Feeds.update({ content, feedUrl, feedImage: "" }, { where: { feedCode: feedCode } })
                return res.status(200).json({
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
                return res.status(200).json({
                    result: "SUCCESS",
                    code: 0,
                    message: "게시글 수정 완료!"
                })
            }
        } catch (err) {
            console.log(err)
            /*=====================================================================================
            #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -4, 'message': "게시글 수정 실패!", }
            }
            =====================================================================================*/
            return res.status(400).json({
                result: "FAIL",
                code: -4,
                message: "게시글 수정 실패!"
            })
        }
    } else {
        /*=====================================================================================
           #swagger.responses[400] = {
          description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
          schema: { "result": "FAIL", 'code': -4, 'message': "작성자가 아니라 수정불가", }
           }
           =====================================================================================*/
        return res.status(400).json({
            result: "FAIL",
            code: -4,
            message: "작성한 사용자가 아니라 수정할 수 없습니다."
        })
    }

}

//게시글 좋아요
exports.likedFeed = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['Feeds']
    #swagger.summary = '게시글 좋아요 API'
    #swagger.description = '게시글 좋아요 API'
    ========================================================================================================*/
    if (!req.body.feedCode || !req.body.userCode || req.body.feedCode === "" || req.body.userCode === "") {


        /*=====================================================================================
        #swagger.responses[400] = {
        description: '필수로 받아야할 입력값(feedCode,userCode)이 들어오지 않았습니다.',
        schema: { "result": "FAIL", 'code': -10, 'message': '필수 입력값 조회 실패', }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: "Fail",
            code: -10,
            message: "필수 입력값 조회 실패"

        })
    }
    const { userCode, feedCode } = req.body;
    try {
        const checkLike = await Liked.findOne({ where: { feedCode, userCode } })
        if (!checkLike) {
            await Liked.create({ userCode, feedCode })
            /*=====================================================================================
            #swagger.responses[200] = {
            description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "SUCCESS", 'code': 0, 'message': '정상', }
            }
            =====================================================================================*/
            return res.status(200).json({
                result: 'SUCCESS',
                code: 0,
                likeState: 'true',
                message: "좋아요"
            })
        } else {
            await Liked.destroy({
                where: { [Op.and]: [{ feedCode }, { userCode }] }

            })
            /*=====================================================================================
            #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -4, 'message': "좋아요 취소" }
            }
            =====================================================================================*/
            return res.status(200).json({
                result: 'SUCCESS',
                code: 0,
                likeState: 'false',
                message: "좋아요 취소"
            })
        }
    } catch (err) {
        console.log(err)
        /*=====================================================================================
       #swagger.responses[400] = {
       description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
       schema: { "result": "FAIL", 'code': -4, 'message': "좋아요 에러 발생하여 불가" }
       }
       =====================================================================================*/
        return res.status(400).json({
            result: "FAIL",
            code: -4,
            message: "에러가 발생하여 좋아요가 불가합니다."
        })
    }

}


