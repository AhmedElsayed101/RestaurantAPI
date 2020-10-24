const express = require('express')
const bodyParser = require('body-parser')
// const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const cors = require('./cors')

const Dishes = require('../models/dishes')
const Favorites = require('../models/favorites')

const favoriteRouter = express.Router()

favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
.options(cors.corsWithOprions, (req, res) => {res.sendStatus(200)})

.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    const userId = req.user._id
    Favorites.findOne({author : userId})
        .populate('author')
        .populate('dishes')
        .then((favorites) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            if (favorites === null) favorites = []
            res.json(favorites)
        }, err => next(err))
        .catch(err => next(err))
})
.post(cors.corsWithOprions, authenticate.verifyUser, (req, res, next) => {

    const userId = req.user._id
    if (!req.body._id){
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json')
        res.json({err : '_id (DishId) is required'})
    }
    const dishId = req.body._id

    Dishes.findById(dishId)
        .then(dish => {
            if (dish !== null) {
                Favorites.findOne({ author : userId})
                    .then((favorites) => {
                        if (favorites !== null){
                            console.log('favs', favorites.dishes)
                            if(favorites.dishes.indexOf(dishId) !== -1){
                                console.log('herererererere')
                                res.statusCode = 200
                                res.setHeader('Content-Type', 'application/json')
                                res.json({err : 'Dish already in the favorite list'})
                            }
                            else{
                            favorites.dishes.push(dishId)
                            favorites.save()
                                .then( newfav => {
                                    res.statusCode = 200
                                    res.setHeader('Content-Type', 'application/json')
                                    res.json({
                                        newfav
                                    })
                                })
                            }
                            // return res
                        }
                        else{
                            Favorites.create({
                                author : userId,
                            })
                            .then(favs => {
                                favs.dishes.push(dishId)
                                favs.save()
                                .then( newfav => {
                                    res.statusCode = 200
                                    res.setHeader('Content-Type', 'application/json')
                                    res.json({
                                        newfav
                                    })
                                }, err => next(err))
                                .catch(err => next(err))
                                // return res
                            }, err => next(err))
                            .catch( err => next(err))
                        }
                    }, err => next(err))
                    .catch(err => next(err))
            }
            else{
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.json({err : 'Dish not found!!'})
            }
        }, err => next(err))
        .catch( err => next(err))

})
.delete(authenticate.verifyUser,(req, res, next) => {
    const userId = req.user._id
    Favorites.deleteOne({author : userId})
        .then(() => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                status : 'success'
            })
        }, err => next(err))
        .catch(err => next(err))
})


favoriteRouter.route('/:dishId')
.options(cors.corsWithOprions, (req, res) => {res.sendStatus(200)})
.post(authenticate.verifyUser, (req, res, next) => {

    const userId = req.user._id
    if (!req.params.dishId){
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json')
        res.json({err : '_id (DishId) is required'})
    }
    const dishId = req.params.dishId

    Dishes.findById(dishId)
        .then(dish => {
            if (dish !== null) {
                Favorites.findOne({ author : userId})
                    .then((favorites) => {
                        if (favorites !== null){
                            console.log('favs', favorites.dishes)
                            if(favorites.dishes.indexOf(dishId) !== -1){
                                console.log('herererererere')
                                res.statusCode = 200
                                res.setHeader('Content-Type', 'application/json')
                                res.json({err : 'Dish already in the favorite list'})
                            }
                            else{
                            favorites.dishes.push(dishId)
                            favorites.save()
                                .then( newfav => {
                                    res.statusCode = 200
                                    res.setHeader('Content-Type', 'application/json')
                                    res.json({
                                        newfav
                                    })
                                })
                            }
                            // return res
                        }
                        else{
                            Favorites.create({
                                author : userId,
                            })
                            .then(favs => {
                                favs.dishes.push(dishId)
                                favs.save()
                                .then( newfav => {
                                    res.statusCode = 200
                                    res.setHeader('Content-Type', 'application/json')
                                    res.json({
                                        newfav
                                    })
                                }, err => next(err))
                                .catch(err => next(err))
                                // return res
                            }, err => next(err))
                            .catch( err => next(err))
                        }
                    }, err => next(err))
                    .catch(err => next(err))
            }
            else{
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.json({err : 'Dish not found!!'})
            }
        }, err => next(err))
        .catch( err => next(err))


})
.delete(authenticate.verifyUser, (req, res ,next) => {
    const userId = req.user._id
    const dishId = req.params.dishId

    Favorites.findOne({author : userId})
        .then((favorites) => {
            if ( favorites.dishes.indexOf(dishId) !== -1 ) {

                const index = favorites.dishes.indexOf(dishId);
                console.log('bef', favorites.dishes)
                favorites.dishes.splice(index, 1)
                console.log('af', favorites.dishes)
                favorites.save()
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    status : 'success'
                })
            }
            else{
                console.log('dishes', favorites.dishes)
                console.log('dish', dishId)
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.json({err : 'Dish not found in the favorites list!!'})
            }
        
        }, err => next(err))
        .catch(err => next(err))
})

module.exports = favoriteRouter