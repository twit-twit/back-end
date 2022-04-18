// Modules
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {Users} = require('../models');
const { hash } = require("bcrypt");

/**
 * 2022. 04. 18. HSYOO.
 * TODO:
 *  1. 
 * 
 * FIXME:
 *  1. 
 */
exports.postLogin = async (req, res) => {
    const {userId, password} = req.body;

    const findUserId = await Users.findOne({ where: {userId, password}});
    if(!findUserId) res.status(401).json({result:'FAIL', code:-1, message:'ID 또는 PW가 일치하지 않음'});

    const token = jwt.sign({userId: findUserId.userId}, process.env.SECRET_KEY, {expiresIn: '60m'});
    res.status.json({
        result:'SUCCESS', code:0, message:'정상', token
    });
}

/**
 * 2022. 04. 18. HSYOO.
 * TODO:
 *  1. 필수입력값 체크
 *      1-1. userId, password, confirmpassword 값 체크
 *      1-2. img는 jpg 또는 png만 업로드 가능 (용량문제)
 *  2. 패스워드 일치 여부 체크
 *      2-1. 패스워드 불일치하는 경우, status code 400 return.
 *  3. 패스워드 암호화 진행
 *      3-1 bcript 사용
 *  4. 위 작업 후 모두 통과 시, 사용자 정보 생성 및 회원가입 완료 return
 * 
 * FIXME:
 *  1. image 업로드 시, jpg 또는 png 여부 체크해야함.
 */
exports.postSignUp = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['Users']
    #swagger.summary = '회원가입 API'
    #swagger.description = '회원가입 API'
    ========================================================================================================*/

    const bodySchema = Joi.object({
        userId: Joi.string().min(4).max(30).error(new Error('유효성 검사 실패 : userId는 4자 이상, 30자 미만')),
        password: Joi.string().pattern(new RegExp('^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{4,20}$')).error(new Error('유효성 검사 실패 : password 이상')),
        confirmpassword: Joi.string().pattern(new RegExp('^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{4,20}$')).error(new Error('유효성 검사 실패 : confirmpassword 이상')),
        image: Joi.any(), // image(이미지)는 필수입력값이 아님, 따로 체크하지 않는다.
        intro: Joi.any(), // intro(자기소개)는 필수입력값이 아님, 따로 체크하지 않는다.
    });
    // const fileSchema = Joi.object({
    //     image: Joi.image().allowTypes(['jpg', 'jpeg', 'png']),
    // });
    try {
        await bodySchema.validateAsync(req.body);
        // await fileSchema.validateAsync(req.file);
    } catch (error) {
        return res.status(400).json({ result: "FAIL", code: -1, message: error.message });
    }

    const {userId, password, confirmPassword, intro} = req.body;
    const {img} = req.file;

    //패스워드 일치여부 검사
    if(password !== confirmPassword)
        return res.status(400).json({ result: 'FAIL', code: '-2', message: '패스워드 불일치' })

    // 패스워드 암호화
    const hashPassword = bcrypt.hashSync(password, process.env.SECRET_KEY);

    console.log(userId, hashPassword, intro, img);

    // const checkCreateUserId = await Users.create({ userId, password: hashPassword, intro, img });
    // console.log(checkCreateUserId);
    
    /*=====================================================================================
    #swagger.responses[200] = {
        description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
        schema: { "result": "SUCCESS", 'code': 0, 'message': '정상', }
    }
    =====================================================================================*/
    res.status(201).json({ result: 'SUCCESS', code: 0, message: '테스트 정상' });
    // res.status(201).json({ result: 'SUCCESS', code: 0, message: '정상' });
}

/**
 * 2022. 04. 18. HSYOO.
 * TODO:
 *  1. 사용자가 입력한 ID에 대한 Valid Check를 진행한다.
 *      1-1. 4자 이상, 30자 이하
 *  2. 사용자가 입력한 ID의 기존재여부를 확인한다.
 *      2-1. 기존재 시, status code 400 return.
 * 
 * FIXME:
 *  1. ID에 대한 Vaid Check 진행해야한다.
 */
exports.getDuplicateUserId = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['Users']
    #swagger.summary = '회원가입 내 회원ID 중복체크 API'
    #swagger.description = '회원가입 진행 중 사용자가 입력한 ID가 기존에 가입되어있는지 확인하는 API'
    #swagger.parameters['userId'] = { description: '(필수)userId를 입력하세요.' }
    ========================================================================================================*/

    const bodySchema = Joi.object({
        userId: Joi.string().min(4).max(30).error(new Error('ServerError - userId는 4자 이상, 30자 미만이어야 합니다.')),
    });
    try {
        await bodySchema.validateAsync(req.query);
    } catch (error) {
        return res.status(400).json({ result: "FAIL", code: -1, message: error.message });
    }
    
    const { userId } = req.query;
    const findUserId = await Users.findOne({ where: {userId} });

    /*=====================================================================================
    #swagger.responses[400] = {
        description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
        schema: { "result": "FAIL", 'code': -1, 'message': '이미 가입된 ID', }
    }
    =====================================================================================*/
    if(findUserId) return res.status(400).json({result: 'FAIL', code:-2, message:'이미 가입된 ID'});

    /*=====================================================================================
    #swagger.responses[200] = {
        description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
        schema: { "result": "SUCCESS", 'code': 0, 'message': '정상', }
    }
    =====================================================================================*/
    res.status(200).json({result: 'SUCCESS', code: 0, message: '정상'});
}