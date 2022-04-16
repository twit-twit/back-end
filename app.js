require('dotenv').config();
const config = require(__dirname + '/config/config.js')
const express = require('express')
const cors = require('cors')

const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
const expressBasicAuth = require('express-basic-auth');


const app = express();

const removeHeader = (req, res, next) => {
    //x-Powerd-By 제거
    res.removeHeader("X-Powered-By");
    next();
};

const Router = require('./routes')
app.use('/api', Router);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(removeHeader);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// app.use( ['/swagger'], expressBasicAuth({ challenge: true, users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD, }, }) )








app.listen(3000, () => {
    console.log(`Listening on : http://localhost:3000`)
})
