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
    const { feedType, userCode } = req.query;

    try {
        if (feedType === 'all') {
            let feedArr = await Feeds.findAll({})

            let result = feedArr.sort((a, b) => b.createdAt - a.createdAt)
            for (let i = 0; i < result.length; i++) {
                let feedCreatedAt = result[i].createdAt
                let feedUpdatedAt = result[i].updatedAt
                result[i].dataValues.createdAt = displayedAt(feedCreatedAt)
                result[i].dataValues.updatedAt = displayedAt(feedUpdatedAt)
            }
            res.status(200).json({ result: "SUCCESS", code: 0, result });

        } else if (feedType === "user") {
            const user = await Users.findOne({ where: { userCode: userCode } })
            const feeds = await user.getFeeds();
            let result = feeds.sort((a, b) => b.createdAt - a.createAt)

            for (let i = 0; i < result.length; i++) {
                let userCreatedAt = result[i].createdAt;
                let userUpdatedAt = result[i].updatedAt;
                result[i].dataValues.createdAt = displayedAt(userCreatedAt)
                result[i].dataValues.updatedAt = displayedAt(userUpdatedAt)

            }


            /*=====================================================================================
            #swagger.responses[200] = {
                description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
                schema: { "result": "SUCCESS", 'code': 0, 'message': '정상', }
            }
            =====================================================================================*/
            res.status(200).json({
                result: "SUCCESS",
                code: 0,
                result
            })

        }

    } catch (err) {
        console.log(err)
        res.status(400).json({
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
    const { feedCode, userCode } = req.query;

    let userFeed = await Feeds.findAll({ where: { feedCode } }).then((user) => {
        return user[0].userCode
    })
    console.log("@@@@", userFeed)
    if (Number(userCode) === userFeed) {

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
    const { feedCode, userCode, content, feedUrl } = req.body;

    //게시글 작성자 찾기
    let userFeed = await Feeds.findAll({ where: { feedCode } }).then((user) => {
        return user[0].userCode
    })

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
            /*=====================================================================================
       #swagger.responses[400] = {
           description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
           schema: { "result": "FAIL", 'code': -4, 'message': "게시글 수정 실패!", }
       }
       =====================================================================================*/
            res.status(400).json({
                result: "FAIL",
                code: -4,
                message: "게시글 수정 실패!"
            })
        }
    } else {
        return res.status(400).json({
            /*=====================================================================================
       #swagger.responses[400] = {
           description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
           schema: { "result": "FAIL", 'code': -4, 'message': "작성자가 아니라 수정불가", }
       }
       =====================================================================================*/
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
          schema: { "result": "FAIL", 'code': -4, 'message': "좋아요 취소, }
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
 schema: { "result": "FAIL", 'code': -4, 'message': "좋아요 에러 발생하여 불가, }
}
=====================================================================================*/
        res.status(400).json({
            result: "FAIL",
            code: -4,
            message: "에러가 발생하여 좋아요가 불가합니다."
        })
    }

}


