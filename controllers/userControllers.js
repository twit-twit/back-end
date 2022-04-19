// Modules
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {Users} = require('../models');

/**
 * 2022. 04. 18. HSYOO.
 * TODO:
 *  1. 필수입력값 체크
 *      1-1 userId, password 입력 값 체크
 *  2. 입력받은 값으로 사용자 존재여부 확인
 *      2-1. 클라이언트에서 받은 패스워드와 DB에서 가져온 패스워드를 복호화하여 비교
 *      2-2. 존재하지 않는다면, status code 400 return
 *  3. 사용자 존재한다면, 해당 사용자에게 token 발급 후 200 return
 * 
 * FIXME:
 *  1. 
 */
exports.postLogin = async (req, res) => {
    const {userId, password} = req.body;

    // 사용자 ID 존재여부 확인
    const findUserId = await Users.findOne({ where: {userId}});
    if(!findUserId)
        return res.status(401).json({ result:'FAIL', code:-1, message:'ID 또는 PW가 일치하지 않음' });

    // 사용자 존재할 경우, 패스워드 체크
    const existHashPassword = bcrypt.compareSync(password, findUserId.password);
    if(!existHashPassword) // bcrypt.compareSync() 메소드는 bcrypt로 DB에 저장된 패스워드와 비교하여 동일한 경우 true를 반환함.
        return res.status(401).json({ result: 'FAIL', code: -1, message: 'ID 또는 PW가 일치하지 않음' });

    // 토큰 유효시간 60분 설정 및 토큰 발급
    const token = jwt.sign({userId: findUserId.userId}, process.env.SECRET_KEY, {expiresIn: '60m'});
    res.status(200).json({
        result:'SUCCESS',
        code:0,
        message:'정상',
        response: token,
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
 *  1. [V] image 업로드 시, jpg 또는 png 여부 체크해야함.
 *  2. [ ] 이미 있는 ID인지 체크해야한다. Thunder Client로 넣을 때는 로직을 안태우기 때문에 여기도 검증해야한다.
 */
exports.postSignUp = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['Users']
    #swagger.summary = '회원가입 API'
    #swagger.description = '회원가입 API'
    ========================================================================================================*/

    const bodySchema = Joi.object({
        userId: Joi.string().min(4).max(30).error(new Error('유효성 검사 실패 : userId는 4자 이상, 30자 미만')),
        password: Joi.string().regex(new RegExp(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{4,20}$/)).error(new Error('유효성 검사 실패 : password 이상')),
        confirmpassword: Joi.string().regex(new RegExp(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{4,20}$/)).error(new Error('유효성 검사 실패 : confirmpassword 이상')),
        image: Joi.any(), // image(이미지)는 필수입력값이 아님, 따로 체크하지 않는다.
        intro: Joi.any(), // intro(자기소개)는 필수입력값이 아님, 따로 체크하지 않는다.
    });
    try {
        console.log(req.body.password, req.body.confirmpassword);
        await bodySchema.validateAsync(req.body);
    } catch (error) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -1, 'message': '유효성 검사 실패 : 사유', }
        }
        =====================================================================================*/
        return res.status(400).json({ result: "FAIL", code: -1, message: error.message });
    }

    const {userId, password, confirmpassword, intro} = req.body;
    const image = req.file === undefined ? null : '/image/' + req.file.filename

    // ID 기존재 여부 검사
    const findUserId = await Users.findOne({ where: {userId} });
    /*=====================================================================================
    #swagger.responses[400] = {
        description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
        schema: { "result": "FAIL", 'code': -2, 'message': '이미 가입된 ID', }
    }
    =====================================================================================*/
    if(findUserId) return res.status(400).json({result: 'FAIL', code:-2, message:'이미 가입된 ID'});

    //패스워드 일치여부 검사
    if(password !== confirmpassword)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '비정상 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -2, 'message': '패스워드 불일치', }
        }
        =====================================================================================*/
        return res.status(400).json({ result: 'FAIL', code: -3, message: '패스워드 불일치' });

    // 패스워드 암호화
    const hashPassword = bcrypt.hashSync(password, +process.env.SECRET_KEY);

    const checkCreateUserId = await Users.create({ 
        userId,
        password: hashPassword,
        intro,
        img: image,
    });
    
    /*=====================================================================================
    #swagger.responses[201] = {
        description: '정상적인 값을 응답받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
        schema: { "result": "SUCCESS", 'code': 0, 'message': '정상', }
    }
    =====================================================================================*/
    res.status(201).json({ result: 'SUCCESS', code: 0, message: '정상' });
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
 *  1. [V] ID에 대한 Vaid Check 진행해야한다.
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
        schema: { "result": "FAIL", 'code': -2, 'message': '이미 가입된 ID', }
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

/**
 * 2022. 04. 18. HSYOO.
 * TODO:
 *  1. 사용자가 입력한 ID에 대한 Valid Check를 진행한다.
 *      1-1. 4자 이상, 30자 이하
 *  2. 사용자가 입력한 ID의 기존재여부를 확인한다.
 *      2-1. 기존재 시, status code 400 return.
 * 
 * FIXME:
 *  1. [V] ID에 대한 Vaid Check 진행해야한다.
 */
exports.getValidAuthCheck = (req, res) => {
    try {
        const { user } = res.locals;
        res.status(200).json({
            userId: user.userId,
        });
    } catch (err) {
        res.status(400).json({ result: "FAIL", message: "유저를 확인할 수 없습니다." });
    }
}