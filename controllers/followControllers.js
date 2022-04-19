const { Follows, Users } = require("../models")
const { Op } = require("sequelize")

exports.getMyFollows = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['follows']
    #swagger.summary = '팔로우 조회 API'
    #swagger.description = '내가 팔로우한 모든 유저 목록을 조회하는 API'
    ========================================================================================================*/
    if (!req.query.userCode) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: 'userCode가 query로 입력되지 않았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -10, 'message': "필수 입력값 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: "Fail", code: -10, message: "필수 입력값 조회 실패" }) 
    }
    const { userCode } = req.query;
    const isUser = await Users.findOne({ where: { userCode } })
    if (!isUser) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 userCode가 DB에 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -11, 'message': "데이터베이스 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: 'FAIL', code: -11, message: "데이터베이스 조회 실패" })
    }
    try {
        const myFollows = await Follows.findAll({ where: { userCode } })
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "SUCCESS", 'code': 0, 'message': '팔로우 GET 성공' }
        }
        =====================================================================================*/
        return res.status(200).json({ result: 'SUCCESS', code: 0, message:'팔로우 GET 성공', myFollows })
    } catch (err) {
        console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 GET 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: 'FAIL', code: -5, message: "팔로우 GET 실패" })
    }
}

exports.postMyFollows = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['follows']
    #swagger.summary = '팔로우 API'
    #swagger.description = '팔로우 API'
    ========================================================================================================*/
    if ( !req.body.userCode || !req.body.followUserCode ) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: 'userCode, followUserCode가 body로 입력되지 않았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -10, 'message': "필수 입력값 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: "Fail", code: -10, message: "필수 입력값 조회 실패" }) 
    }
    const { userCode, followUserCode } = req.body;
    const isUser = await Users.findOne({ where: { userCode } })
    const existUser = await Users.findOne({ where : { userCode: followUserCode } });
    const findFollow = await Follows.findOne({ where: { userCode, followUserCode } })
    if (!isUser || !existUser || findFollow ) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 userCode, followUserCode가 DB에 존재하지 않거나 findFollow가 DB에 존재할 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -11, 'message': "데이터베이스 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: 'FAIL', code: -11, message: "데이터베이스 조회 실패" })
    }
    if ( Number(userCode) !== Number(followUserCode) ) {
        try {
            await Follows.create({
                userCode,
                followUserCode
            })
            /*=====================================================================================
            #swagger.responses[201] = {
                description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
                schema: { "result": "SUCCESS", 'code': 0, 'message': '팔로우 POST 성공' }
            }
            =====================================================================================*/
            return res.status(201).json({ result: 'SUCCESS', code: 0, message:'팔로우 POST 성공' })
        } catch (err) {
            console.log(err)
            /*=====================================================================================
            #swagger.responses[400] = {
                description: '비정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
                schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 POST 실패" }
            }
            =====================================================================================*/
            return res.status(400).json({ result: 'FAIL', code: -5, message: "팔로우 POST 실패" })
        }
    } else {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 POST 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: 'FAIL', code: -5, message: "팔로우 POST 실패" })
    }
}

exports.deleteMyFollows = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['follows']
    #swagger.summary = '팔로우 취소 API'
    #swagger.description = '이미 팔로우했던 유저를 내가 팔로우한 유저 목록에서 삭제하는 API'
    ========================================================================================================*/
    if ( !req.query.userCode || !req.query.followUserCode ) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: 'userCode, followUserCode가 query로 입력되지 않았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -10, 'message': "필수 입력값 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: "Fail", code: -10, message: "필수 입력값 조회 실패" }) 
    }
    const { userCode, followUserCode } = req.query;
    const isUser = await Users.findOne({ where: { userCode } })
    const existUser = await Users.findOne({ where : { userCode: followUserCode } })
    const findFollow = await Follows.findOne({ where: { userCode, followUserCode } })
    if (!isUser || !existUser || !findFollow ) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 userCode, followUserCode와 findFollow가 DB에 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -11, 'message': "데이터베이스 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: 'FAIL', code: -11, message: "데이터베이스 조회 실패" })
    }
    try {
        await Follows.destroy({ where: { userCode, followUserCode } })
        /*=====================================================================================
        #swagger.responses[201] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "SUCCESS", 'code': 0, 'message': '팔로우 DELETE 성공' }
        }
        =====================================================================================*/
        return res.status(201).json({ result: 'SUCCESS', code: 0, message:'팔로우 DELETE 성공' })
    } catch (err) {
        console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 DELETE 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: 'FAIL', code: -5, message: "팔로우 DELETE 실패" }) }
}

exports.getMyFollowers = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['follows']
    #swagger.summary = '팔로워 조회 API'
    #swagger.description = '나를 팔로우한 모든 유저 목록을 조회하는 API'
    ========================================================================================================*/
    if (!req.query.userCode) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: 'userCode가 query로 입력되지 않았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -10, 'message': "필수 입력값 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: "Fail", code: -10, message: "필수 입력값 조회 실패" }) 
    }
    const { userCode } = req.query;
    const isUser = await Users.findOne({ where: {userCode} })
    if (!isUser) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 userCode가 DB에 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -11, 'message': "데이터베이스 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: 'FAIL', code: -11, message: "데이터베이스 조회 실패" })
    }
    try {
        const myFollowers = await Follows.findAll({ where: { followUserCode: userCode },
            attributes: { exclude: ['followId', 'followUserCode', 'createdAt', 'updatedAt'] }
        })
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "SUCCESS", 'code': 0, 'message': '팔로워 GET 성공' }
        }
        =====================================================================================*/
        return res.status(200).json({ result: 'SUCCESS', code: 0, message:'팔로워 GET 성공', myFollowers })
    } catch (err) {
        console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로워 GET 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: 'FAIL', code: -5, message: "팔로워 GET 실패" })
    }
}

exports.getRecommendFriends = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['follows']
    #swagger.summary = '팔로우 추천 API'
    #swagger.description = '내가 팔로우하지 않은 유저 목록을 조회하는 API'
    ========================================================================================================*/
    if (!req.query.userCode) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: 'userCode가 query로 입력되지 않았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -10, 'message': "필수 입력값 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: "Fail", code: -10, message: "필수 입력값 조회 실패" }) 
    }
    const { userCode } = req.query;
    const isUser = await Users.findOne({ where: { userCode } })
    if (!isUser) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 userCode가 DB에 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -11, 'message': "데이터베이스 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: 'FAIL', code: -11, message: "데이터베이스 조회 실패" })
    }
    try {
        // const myFollowers = await Follows.findAll({
        //     attributes: { exclude: ['followId', 'followUserCode', 'createdAt', 'updatedAt'] },
        //     where: {
        //         followUserCode: userCode
        //     }
        // })
        const myFollows = await Follows.findAll({ where: { userCode } }).map((x)=>{
            return x.followUserCode
        })
        const recommendFriendships = await Users.findAll({ where: { userCode: { [Op.notIn]: myFollows } }, 
            attributes: { exclude: ['userId', 'password', 'intro', 'img', 'createdAt', 'updatedAt'] }
        })
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "SUCCESS", 'code': 0, 'message': '팔로우 추천 GET 성공' }
        }
        =====================================================================================*/
        return res.status(200).json({ result: 'SUCCESS', code: 0, message:'팔로우 추천 GET 성공', recommendFriendships })
    } catch (err) {
        console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 추천 GET 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: 'FAIL', code: -5, message: "팔로우 추천 GET 실패" })
    }
}