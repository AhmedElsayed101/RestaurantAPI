const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../authenticate')
const Promotions = require('../models/promotions')
const cors = require('./cors')

const promotionsRouter = express.Router()

promotionsRouter.use(bodyParser.json())


promotionsRouter.route('/')
.options(cors.corsWithOprions, (req, res) => {res.sendStatus(200)})

.get(cors.cors, (req, res, next) => {
    Promotions.find({})
    .then((promotions) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotions)
    }, (err) => next(err) )
    .catch ((err) => {next(err)})
})
.post(cors.corsWithOprions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body)
    .then((promotion) => {
        console.log('promotion created: ', promotion)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotion)
    }, (err) => next(err) )
    .catch ((err) => {next(err)})

})
.put(cors.corsWithOprions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT is not supported')
})
.delete(cors.corsWithOprions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});


promotionsRouter.route('/:promotionId')
.options(cors.corsWithOprions, (req, res) => {res.sendStatus(200)})

.get(cors.cors, (req,res,next) => {
    const promotionId = req.params.promotionId
    Promotions.findById(promotionId, )
    .then((promotion) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotion)
    }, (err) => next(err) )
    .catch ((err) => {next(err)})
})
.post(cors.corsWithOprions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /Promotions/'+ req.params.promotionId);
})
.put(cors.corsWithOprions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    const promotionId = req.params.promotionId
    const updatedData = req.body
    Promotions.findOneAndUpdate(promotionId, {
        $set : updatedData
    }, { new : true })
    .then((promotion) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotion)
    }, (err) => next(err) )
    .catch ((err) => {next(err)})
})
.delete(cors.corsWithOprions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    const promotionId = req.params.promotionId
    Promotions.findOneAndRemove(promotionId)
    .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, (err) => console.log('err', err))
    .catch((err) => console.log('err', err))
})




module.exports = promotionsRouter