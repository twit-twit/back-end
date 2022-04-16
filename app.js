const express = require('express')
const cors = require('cors')
const routes = require('./routes')


const app = express();


app.use(cors())









app.listen(3000, () => {
    console.log(`Listening on : http://localhost:3000`)
})
