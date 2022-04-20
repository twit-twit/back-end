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
            description: 'userCode 입력되지 않았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -10, 'message': "필수 입력값 조회 실패", }
        }
        =====================================================================================*/
        return res.status(400).json({ result: "Fail", code: -10, message: "필수 입력값 조회 실패" }) }
    const { userCode } = req.query;
    const isUser = await Users.findOne({ where: { userCode } })
    if (!isUser) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 userCode가 존재하지 않는 유저일 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 조회 실패", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: 'FAIL',
            code: -5,
            message: "팔로우 조회 실패"
        })
    }
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
        return res.status(200).json({
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
        return res.status(400).json({
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
    if ( !req.body.userCode || !req.body.followUserCode ) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: 'userCode, followUserCode가 입력되지 않았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -10, 'message': "필수 입력값 조회 실패", }
        }
        =====================================================================================*/
        return res.status(400).json({ result: "Fail", code: -10, message: "필수 입력값 조회 실패" }) 
    }
    const isUser = await Users.findOne({ where: { userCode } })
    const existUser = await Users.findOne({ where : { userCode: followUserCode } });
    const { userCode, followUserCode } = req.body;
    const findFollow = await Follows.findOne({ where: { userCode, followUserCode } })
    if (!isUser || !existUser || Number(userCode) === Number(followUserCode) || findFollow ) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 실패1", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: "FAIL", 
            code: -5, 
            message: "팔로우 실패1"
        })
    }
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
        return res.status(201).json({
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
        return res.status(400).json({
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
    if ( !req.query.userCode || !req.query.followUserCode ) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: 'userCode, followUserCode가 입력되지 않았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -10, 'message': "필수 입력값 조회 실패", }
        }
        =====================================================================================*/
        return res.status(400).json({ result: "Fail", code: -10, message: "필수 입력값 조회 실패" }) }
    const { userCode, followUserCode } = req.query;
    const isUser = await Users.findOne({ where: { userCode } })
    const existUser = await Users.findOne({ where : { userCode: followUserCode } });
    if (!isUser || !existUser ) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 실패1", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: "FAIL",
            code: -5,
            message: "팔로우 실패1"
        })
    }
    const findFollow = await Follows.findOne({ where: { userCode, followUserCode } })
    if ( findFollow ) {
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
            return res.status(201).json({
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
            return res.status(400).json({
                result: 'FAIL',
                code: -5,
                message: "팔로우 취소 실패"
            })
        }
    } else {
        return res.status(400).json({
            /*=====================================================================================
            #swagger.responses[400] = {
                description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
                schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 취소 실패", }
            }
            =====================================================================================*/
            result: "FAIL",
            code: -5,
            message: "팔로우 취소 실패"
        })
    }
    
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
            description: 'userCode가 입력되지 않았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -10, 'message': "필수 입력값 조회 실패", }
        }
        =====================================================================================*/
        return res.status(400).json({ result: "Fail", code: -10, message: "필수 입력값 조회 실패" }) }
    const { userCode } = req.query;
    const isUser = await Users.findOne({ where: {userCode} })
    if (!isUser) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 userCode가 존재하지 않는 유저일 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로워 조회 실패", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: 'FAIL',
            code: -5,
            message: "팔로워 조회 실패"
        })
    }
    try {
        const myFollowers = await Follows.findAll({
            attributes: { exclude: ['followId', 'followUserCode', 'createdAt', 'updatedAt'] },
            where: {
                followUserCode: userCode
            }
        })
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "SUCCESS", 'code': 0, 'message': '팔로워 조회 성공', }
        }
        =====================================================================================*/
        return res.status(200).json({
            result: 'SUCCESS',
            code: 0,
            message:'팔로워 조회 성공',
            myFollowers
        })
    } catch (err) {
        console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로워 조회 실패", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: 'FAIL',
            code: -5,
            message: "팔로워 조회 실패"
        })
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
            description: 'userCode가 입력되지 않았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -10, 'message': "필수 입력값 조회 실패", }
        }
        =====================================================================================*/
        return res.status(400).json({ result: "Fail", code: -10, message: "필수 입력값 조회 실패" }) }
    const { userCode } = req.query;
    const isUser = await Users.findOne({ where: { userCode } })
    if (!isUser) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 userCode가 존재하지 않는 유저일 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 추천 실패", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: 'FAIL',
            code: -5,
            message: "팔로우 추천 실패"
        })
    }
    try {
        // const myFollowers = await Follows.findAll({
        //     attributes: { exclude: ['followId', 'followUserCode', 'createdAt', 'updatedAt'] },
        //     where: {
        //         followUserCode: userCode
        //     }
        // })
        const myFollows = await Follows.findAll({
            where: {
                userCode
            }
        }).map((x)=>{return x.followUserCode})
        console.log('myFollows', myFollows)

        let recommendFriendships = await Users.findAll({
            attributes: { exclude: ['userId', 'password', 'intro', 'img', 'createdAt', 'updatedAt'] },
            where: {
                userCode: {
                    [Op.notIn]: myFollows
                }
            }
        })
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "SUCCESS", 'code': 0, 'message': '팔로우 추천 성공', }
        }
        =====================================================================================*/
        return res.status(200).json({
            result: 'SUCCESS',
            code: 0,
            message:'팔로우 추천 성공',
            recommendFriendships
        })
    } catch (err) {
        console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -5, 'message': "팔로우 추천 실패", }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: 'FAIL',
            code: -5,
            message: "팔로우 추천 실패"
        })
    }
}