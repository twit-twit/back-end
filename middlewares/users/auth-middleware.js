const jwt = require('jsonwebtoken');
const { Users } = require('../../models');

module.exports = async (req, res, next) => {

  const { authorization } = req.headers;
  if(!authorization)
    return res.status(401).json({ result: 'FAIL', code: -1, message: '요청 헤더 내 authorization 값이 존재하지 않습니다.' });
  if(authorization.split(' ').length !== 2)
    return res.status(401).json({ result: 'FAIL', code: -2, message: '요청 헤더 내 authorization 값이 올바르지 않습니다.' });

  const [tokenType, tokenValue] = authorization.split(' ');
  if (tokenType !== 'Bearer')
    return res.status(401).json({ result: 'FAIL', code: -10, message: '로그인 후 사용하세요' });
    
  try{
    const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY);
    const findUser = await Users.findOne({ where: {userId} });
    console.log(findUser);
    
    if (!findUser) return Storage.removeItem('token');
    res.locals.user = findUser;
    next();
  }catch(err){
    return res.status(401).json({ result: 'FAIL', code: -20, message: '잘못된 접근입니다.' });
  }
};
