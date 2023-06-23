const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./datasource')
app.use(express.json());
const port = 3001

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({
        info: 'Node.js, Express, and Postgres API'
    })
})


app.post('/bme', db.createBME)
app.get('/getbme', db.getBME)
app.get('/getT', db.getT)
app.get('/getH', db.getH)
app.get('/getCarbon', db.getCarbon)
app.post('/carbon', db.carbon)
app.get('/getH', db.getH)


app.listen(port, () => {
    console.log(`Listen to port ${port}`)
})
