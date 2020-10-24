const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../authenticate')
const Leaders = require('../models/leaders')
const cors = require('./cors')

const leadersRouter = express.Router()

leadersRouter.use(bodyParser.json())


leadersRouter.route('/')
.options(cors.corsWithOprions, (req, res) => {res.sendStatus(200)})

.get(cors.cors, (req, res, next) => {
    Leaders.find({})
    .then((leaders) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leaders)
    }, (err) => next(err) )
    .catch ((err) => {next(err)})
})
.post(cors.corsWithOprions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body)
    .then((leader) => {
        console.log('leader created: ', leader)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leader)
    }, (err) => next(err) )
    .catch ((err) => {next(err)})

})
.put(cors.corsWithOprions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT is not supported')
})
.delete(cors.corsWithOprions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});


leadersRouter.route('/:leaderId')
.options(cors.corsWithOprions, (req, res) => {res.sendStatus(200)})

.get(cors.cors, (req,res,next) => {
    const leaderId = req.params.leaderId
    Leaders.findById(leaderId, )
    .then((leader) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leader)
    }, (err) => next(err) )
    .catch ((err) => {next(err)})
})
.post(cors.corsWithOprions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /Leaders/'+ req.params.leaderId);
})
.put(cors.corsWithOprions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    const leaderId = req.params.leaderId
    const updatedData = req.body
    Leaders.findOneAndUpdate(leaderId, {
        $set : updatedData
    }, { new : true })
    .then((leader) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leader)
    }, (err) => next(err) )
    .catch ((err) => {next(err)})
})
.delete(cors.corsWithOprions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    const leaderId = req.params.leaderId
    Leaders.findOneAndRemove(leaderId)
    .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, (err) => console.log('err', err))
    .catch((err) => console.log('err', err))
})


module.exports = leadersRouter