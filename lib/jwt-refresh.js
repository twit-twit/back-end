const {sign, verify, refreshVerify} = require('./jwt-util');
const jwt = require('jsonwebtoken');

const refresh = async (req, res) => {
    // 클라이언트에서 요청할 때, Access Token과 Refresh Token은 전부 헤더에 담아서 요청시킨다.
    if(req.headers.authorization && req.headers.refresh){
        const authToken = req.headers.authorization.split(' ')[1];
        const refreshToken = req.headers.refresh;

        const authResult = verify(authToken);
        const decoded = jwt.decode(authToken);

        if(decoded === null)
            return res.status(401).json({ result: 'FAIL', code: -2, message: '권한이 없습니다.'});
        
        // Refresh Token이 만료되지 않았다면, true을 반환함.
        const refreshResult = refreshVerify(refreshToken, decoded.userId);
        

        if(authResult.result === 'FAIL' && authResult.message === 'jwt expired'){ //클라이언트에서 요청한 Access Token이 만료된 경우

            if(!refreshResult) // 서버에 있는 Refresh Token이 만료된 경우에는 새로 로그인을 시켜야한다. status code 401 return
                return res.status(401).json({ result: 'FAIL', code: -3, message: '해당 사용자의 Refresh Token이 만료되었습니다. 재로그인이 필요합니다.' });
            else{ // 서버에 있는 Refresh Token이 만료되지 않았을 땐, 다시 Access Token과 Refresh Token을 내려준다.
                console.log(refreshResult);
                return res.status(200).json({ result: 'SUCCESS', code: 0, message: '정상', response: {accessToken: sign({userId: decoded.userId}), refreshToken} });
            }
            
        }else{ // 클라이언트에서 요청한 Access Token이 만료되지 않은 경우
            return res.status(400).json({ result: 'FAIL', code: -4, message: '해당 사용자의 Access Token이 만료되지 않았습니다.' });
        }

    }else{
        // 여기에 들어왔다는 얘기는 클라이언트에서 Access Token 또는 Refresh Token이 헤더에 정상적으로 들어오지 않았다는 얘기다.
        return res.status(400).json({ result: 'FAIL', code: -1, message: 'accessToken 또는 refreshToken값이 존재하지 않습니다.' });
    }
}

module.exports = refresh;