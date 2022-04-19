const { promisify } = require('util'); 
const jwt = require('jsonwebtoken');
const redisClient = require('./redis');
const secret = process.env.SECRET_KEY;

module.exports = {
    // Access token 발급
    sign: (user) => {
        const payload = {
            id: user.id,
            role: user.role
        };
        return jwt.sign(payload, secret, {
            algorithm: 'HS256',
            expiresIn: '1h',
        });
    },
    // Access token 검증
    verify: (token) => {
        let decoded = null;
        try {
            decoded = jwt.verify(token, secret);
            return {
                result: 'SUCCESS',
                id: decoded.id,
                role: decoded.role
            };
        } catch (error) {
            return {
                result: 'FAIL',
                message: error.message,
            };
        }
    },
    // Refresh token 발급
    refresh: () => {
        return jwt.sign({}, secret, { // refresh token은 payload가 없다.
           algorithm: 'HS256' ,
           expiresIn: '14d',
        });
    },
    // Refresh token 검증
    refreshVerify: async (token, userId) => {
        // redisClient는 promise를 반환하지 않는다. 따라서, promisify를 이용해 promise를 반환하게 한다.
        const getAsync = promisify(redisClient.get).bind(redisClient);
        try {
            const data = await getAsync(userId);
            if(token === data){
                try {
                    jwt.verify(token, secret);
                    return true;
                } catch (error) {
                    return false;
                }
            }else{
                return false;
            }
        } catch (error) {
            return false;
        }
    },
};