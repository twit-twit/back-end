const jwt = require("jsonwebtoken");

const {Users} = require('../models');

exports.postLogin = async (req, res) => {
    const {userId, password} = req.body;

    const findUserId = await Users.findOne({ where: {userId, password}});
    if(!findUserId) res.status(401).json({result:'FAIL', code:-1, message:'ID 또는 PW가 일치하지 않음'});

    const token = jwt.sign({userId: findUserId.userId}, process.env.SECRET_KEY, {expiresIn: '60m'});
    res.status.json({
        result:'SUCCESS', code:0, message:'정상', token
    });
}

exports.postSignUp = async (req, res) => {
    const {userId, password, confirmPassword, img, intro} = req.body;
    // const 

    res.send('희희');
}

/**
 * TODO:
 *  1. 사용자가 입력한 ID에 대한 Valid Check를 진행한다.
 *      1-1. 4자 이상, 30자 이하
 *  2. 사용자가 입력한 ID의 기존재여부를 확인한다.
 *      2-1. 기존재 시, status code 400 return.
 */
exports.getDuplicateUserId = async (req, res) => {
    const { userId } = req.query;

    const findUserId = await Users.findOne({ where: {userId}});
    if(findUserId) res.status(400).json({result: 'FAIL', code:-1, message:'이미 가입된 ID'});

    res.status(200).json({result: 'SUCCESS', code: 0, message: '정상'});
}