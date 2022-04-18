const jwt = require('jsonwebtoken');
const User = require('../schemas/user');

module.exports = async (req, res, next) => {

  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: '요청 헤더 내 authorization 값이 존재하지 않습니다.' });
  if(authorization.split(' ').length !== 2) return res.status(401).json({ message: '요청 헤더 내 authorization 값이 올바르지 않습니다.' });

  const [tokenType, tokenValue] = authorization.split(' ');

  if (tokenType !== 'Bearer') {
    res.status(401).json({
      Message: '로그인 후 사용하세요',
    });
    return;
  }
  try {
    const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY);

    const user = await User.findOne({ userId });

    if (!user) return Storage.removeItem('token');

    res.locals.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      Message: '잘못된 접근입니다.',
    });
    return;
  }
};
