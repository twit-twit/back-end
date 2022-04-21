require('dotenv').config();
// const config = require(__dirname + '/config/config.js')
const express = require('express')
const cors = require('cors')

const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
const expressBasicAuth = require('express-basic-auth');

const http = require('http');
const https = require('https');
const fs = require('fs');


const app = express();



const removeHeader = (req, res, next) => {
    //x-Powerd-By 제거
    res.removeHeader("X-Powered-By");
    next();
};
const whitelist = ['http://localhost:3000', 'http://twitter-clone-coding.s3-website.ap-northeast-2.amazonaws.com'];
const corsOptions = {
	origin: function (origin, callback) {
		if(whitelist.indexOf(origin) !== -1){
			callback(null, true);
		}else{
			callback(new Error('Not Allowed Origin!'));
		}
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: false,
	optionsSuccessStatus: 204,
	credentials: true,
};
//app.use(
//    cors({
//        origin: ['http://localhost:3000', 'http://twitter-clone-coding.s3-website.ap-northeast-2.amazonaws.com/'],
//        //credentials: true,
//    })
//)

app.use(cors(corsOptions));

app.use(morgan("combined"));
app.use(express.json());
app.use(express.static("public"));
app.use('/image', express.static('./uploads'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(removeHeader);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// app.use( ['/swagger'], expressBasicAuth({ challenge: true, users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD, }, }) )

const Router = require('./routes')
app.use('/api', Router);

//아래 코드는 항상 가장 아래에 존재해야함.
app.use((err, req, res, next) => {
    res.json({ result: 'FAIL', code: -20, message: err.message });
})
if(process.env.REAL){
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/sparta-hs.shop/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/sparta-hs.shop/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/sparta-hs.shop/chain.pem', 'utf8');

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };

    // Starting both http & https servers
    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(credentials, app);

    httpServer.listen(80, () => {
        console.log('HTTP Server running on port 80');
    });

    httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443');
    });
}else{
    app.listen(3000, () => {
        console.log(`Listening on : http://localhost:3000`)
    });
}
