const { Feeds, Users, Comment } = require("../models")
const { Op } = require("sequelize")

exports.getComments = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['comments']
    #swagger.summary = '코멘트 조회 API'
    #swagger.description = '특정 피드의 코멘트 목록을 모두 조회하는 API'
    ========================================================================================================*/
    const { feedCode } = req.query;
    const isExist = await Users.findOne({ where: { feedCode } })
    if (!isExist) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 feedCode가 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -6, 'message': "코멘트 조회 실패", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: 'FAIL',
            code: -6,
            message: "코멘트 조회 실패"
        })
    }
    try {
        const comments = await Comment.findAll({
            where: {
                feedCode
            }
        })
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "SUCCESS", 'code': 0, 'message': '코멘트 조회 성공', }
        }
        =====================================================================================*/
        return res.status(200).json({
            result: 'SUCCESS',
            code: 0,
            message:'코멘트 조회 성공',
            comments
        })
    } catch (err) {
        console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -6, 'message': "코멘트 조회 실패", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: 'FAIL',
            code: -6,
            message: "코멘트 조회 실패"
        })
    }
}

exports.postComments = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['comments']
    #swagger.summary = '코멘트 작성 API'
    #swagger.description = '특정 피드에 나의 코멘트를 작성하는 API'
    ========================================================================================================*/
    const { feedCode, userCode, content } = req.body;
    const isExistFeed = await Feeds.findOne({ where: { feedCode } })
    if (!isExistFeed) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 feedCode가 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -6, 'message': "코멘트 작성 실패1", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: 'FAIL',
            code: -6,
            message: "코멘트 작성 실패1"
        })
    }
    const isExistUser = await Users.findOne({ where: { userCode } })
    if (!isExistUser) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 userCode가 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -6, 'message': "코멘트 작성 실패2", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: 'FAIL',
            code: -6,
            message: "코멘트 작성 실패2"
        })
    }
    if (content === "" || content === null) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: 'content가 입력되지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -6, 'message': "코멘트 작성 실패3", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: "FAIL",
            code: -6,
            message: "코멘트 작성 실패3"
        })
    }
    try {
        await Comment.create({
            feedCode,
            userCode,
            content
        })
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "SUCCESS", 'code': 0, 'message': '코멘트 작성 성공', }
        }
        =====================================================================================*/
        return res.status(200).json({
            result: 'SUCCESS',
            code: 0,
            message:'코멘트 작성 성공'
        })
    } catch (err) {
        console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -6, 'message': "코멘트 작성 실패", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: 'FAIL',
            code: -6,
            message: "코멘트 작성 실패"
        })
    }
}

exports.putComments = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['comments']
    #swagger.summary = '코멘트 수정 API'
    #swagger.description = '특정 피드에 작성된 나의 코멘트를 수정하는 API'
    ========================================================================================================*/
    const { commentId, feedCode, userCode, content } = req.body;
    const isExistComment = await Comment.findOne({ where: { commentId } })
    if (!isExistComment) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 commentId가 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -6, 'message': "코멘트 수정 실패1", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: 'FAIL',
            code: -6,
            message: "코멘트 수정 실패1"
        })
    }
    const isExistFeed = await Feeds.findOne({ where: { feedCode } })
    if (!isExistFeed) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 feedCode가 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -6, 'message': "코멘트 수정 실패1", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: 'FAIL',
            code: -6,
            message: "코멘트 수정 실패2"
        })
    }
    const isExistUser = await Users.findOne({ where: { userCode } })
    if (!isExistUser) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 userCode가 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -6, 'message': "코멘트 수정 실패3", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: 'FAIL',
            code: -6,
            message: "코멘트 수정 실패3"
        })
    }
    if (content === "" || content === null) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: 'content가 입력되지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -6, 'message': "코멘트 수정 실패4", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: "FAIL",
            code: -6,
            message: "코멘트 수정 실패4"
        })
    }

    //comment 작성자 찾기
    let commentUser = await Comment.findAll({ where: { commentId } }).then((user) => {
        return user[0].userCode
    })
    console.log("commentUser", typeof(commentUser), commentUser)
    
    if(Number(userCode) === commentUser) {
        try {
            await Comment.update({
                feedCode,
                userCode,
                content
            },{ where: {
                commentId
            }
            })
            /*=====================================================================================
            #swagger.responses[200] = {
                description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
                schema: { "result": "SUCCESS", 'code': 0, 'message': '코멘트 수정 성공', }
            }
            =====================================================================================*/
            return res.status(200).json({
                result: 'SUCCESS',
                code: 0,
                message:'코멘트 수정 성공'
            })
        } catch (err) {
            console.log(err)
            /*=====================================================================================
            #swagger.responses[400] = {
                description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
                schema: { "result": "FAIL", 'code': -6, 'message': "코멘트 수정 실패", }
            }
            =====================================================================================*/
            return res.status(400).json({
                result: 'FAIL',
                code: -6,
                message: "코멘트 수정 실패"
            })
        }
    } else {
        return res.status(400).json({
            /*=====================================================================================
            #swagger.responses[400] = {
                description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
                schema: { "result": "FAIL", 'code': -6, 'message': "코멘트 수정 실패", }
            }
            =====================================================================================*/
            result: "FAIL",
            code: -6,
            message: "코멘트 수정 실패"
        })
    }
    
}