const { Follows } = require("../models")
const { Users } = require("../models")

exports.getMyFollows = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['follows']
    #swagger.summary = '팔로우 조회 API'
    #swagger.description = '내가 팔로우한 모든 유저 목록을 조회하는 API'
    ========================================================================================================*/
    const { userCode } = req.query;
    try {
        const myFollows = await Follows.findAll({
            where: {
                userCode
            }
        })
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "SUCCESS", 'code': 0, 'message': '팔로우 조회 성공', }
        }
        =====================================================================================*/
        res.status(200).json({
            result: 'SUCCESS',
            code: 0,
            message:'팔로우 조회 성공',
            myFollows
        })
    } catch (err) {
        console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 조회 실패", }
        }
        =====================================================================================*/
        res.status(400).json({
            result: 'FAIL',
            code: -5,
            message: "팔로우 조회 실패"
        })
    }
}

exports.postMyFollows = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['follows']
    #swagger.summary = '팔로우 API'
    #swagger.description = '팔로우 API'
    ========================================================================================================*/
    const { userCode, followUserCode } = req.body;
    console.log(req.body)
    const findFollow = await Follows.findOne({ where: { userCode, followUserCode } })
    console.log("변수 확인? 실제로 있을 때, 없을 때 배열인지?", typeof(findFollow), findFollow)
    /*=====================================================================================
    #swagger.responses[400] = {
        description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
        schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 실패", }
    }
    =====================================================================================*/
    if (userCode===followUserCode) {res.status(400).json({result: "FAIL", code: -5, message: "팔로우 실패"})}
    /*=====================================================================================
    #swagger.responses[400] = {
        description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
        schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 실패", }
    }
    =====================================================================================*/
    if (findFollow) {res.status(400).json({result: "FAIL", code: -5, message: "팔로우 실패"})}
    try {
        await Follows.create({
            userCode,
            followUserCode
        })
        /*=====================================================================================
        #swagger.responses[201] = {
            description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "SUCCESS", 'code': 0, 'message': '팔로우 성공', }
        }
        =====================================================================================*/
        res.status(201).json({
            result: 'SUCCESS',
            code: 0,
            message:'팔로우 성공'
        })
    } catch (err) {
        console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 실패", }
        }
        =====================================================================================*/
        res.status(400).json({
            result: 'FAIL',
            code: -5,
            message: "팔로우 실패"
        })
    }
}

exports.deleteMyFollows = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['follows']
    #swagger.summary = '팔로우 취소 API'
    #swagger.description = '이미 팔로우했던 유저를 내가 팔로우한 유저 목록에서 삭제하는 API'
    ========================================================================================================*/
    const { userCode, followUserCode } = req.params;
    try {
        await Follows.destroy({
            where: {
                userCode,
                followUserCode
            }
        })
        /*=====================================================================================
        #swagger.responses[201] = {
            description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "SUCCESS", 'code': 0, 'message': '팔로우 취소 성공', }
        }
        =====================================================================================*/
        res.status(201).json({
            result: 'SUCCESS',
            code: 0,
            message:'팔로우 취소 성공'
        })
    } catch (err) {
        console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 취소 실패", }
        }
        =====================================================================================*/
        res.status(400).json({
            result: 'FAIL',
            code: -5,
            message: "팔로우 취소 실패"
        })
    }
}