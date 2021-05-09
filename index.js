/**
 * Aabo Technologies 2021
 */

'use-strict'
const express = require('express')
const asyncHandler = require('express-async-handler')


const enroll = require('./controllers/enroll')
const user = require('./controllers/user')
const invoke = require('./controllers/invoke')
const query = require('./controllers/query')

const app = express()
const port = 80

app.use(express.json())

const addCORSHeaders = (res, origin) => {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
    return res
}

app.post('/enrollAdmin', asyncHandler(async (req, res, next) => {
    const result = await enroll.main()
    const origin = req.get('origin')
    res = addCORSHeaders(res, origin)
    res.send(result)
}))

app.post('/enrollUser', asyncHandler(async (req, res, next) => {
    const result = await user.main()
    const origin = req.get('origin')
    res = addCORSHeaders(res, origin)
    res.send(result)
}))

app.post('/test/enrollUser', asyncHandler(async (req, res, next) => {
    const result = await invoke.testInvoke('user1')
    const origin = req.get('origin')
    res = addCORSHeaders(res, origin)
    res.send(result)
}))

app.post('/passport/create/:id/:firstname/:lastname/:dob/:s3URL/:patientNumber/:country/:dynamoHash', asyncHandler( async (req, res, next) => {
    const received = req.params
    const origin = req.get('origin')
    res = addCORSHeaders(res, origin)
    const result = await invoke.createPassport(received.id,received.firstname,received.lastname,received.dob,received.s3URL,received.patientNumber,received.country,received.dynamoHash)
    res.sendStatus(200)
}))

app.post('/passport/status/validation/:id/:status', asyncHandler(async (req, res, next) => {
    const received = req.params
    const origin = req.get('origin')
    res = addCORSHeaders(res, origin)
    const result = await invoke.changeValidationStatus(received.id,received.status)
    res.sendStatus(200)
}))

app.post('/passport/status/vaccination/:id/:status', asyncHandler(async (req, res, next) => {
    const received = req.params
    const origin = req.get('origin')
    res = addCORSHeaders(res, origin)
    const result = await invoke.changeVaxStatus(received.id,received.status)
    res.sendStatus(200)
}))


app.get('/passport/read/:id/:user', asyncHandler(async (req, res, next) => {
    const received = req.params
    const origin = req.get('origin')
    res = addCORSHeaders(res, origin)
    const result = await query.readPassport(received.id, received.user)
    res.sendStatus(200)
}))

app.get('/passport/history/:id/:user', asyncHandler(async (req, res, next) => {
    const received = req.params
    const origin = req.get('origin')
    res = addCORSHeaders(res, origin)
    const result = await query.getHistoryForPassport(received.id, received.user)
    res.sendStatus(200)
}))

app.listen(port, () => console.info('Blockchain API listening on port:', port))