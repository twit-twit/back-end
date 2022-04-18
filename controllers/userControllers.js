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