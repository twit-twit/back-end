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