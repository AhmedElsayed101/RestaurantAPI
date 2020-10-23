const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/users')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')

const config = require('./config')
// const f = require('session-file-store')

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn : 3600
    })
}

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_paload, done) => {
    console.log('payload', jwt_paload)
    User.findOne({_id : jwt_paload._id}, (err, user) => {
        console.log('1')
        if (err){
            console.log('2')

            return done(err, false)
            
        }
        else if (user){
            console.log('3')
            return done(null, user)
        }
        else {
            console.log('4')

            return done(null, false)
        }
    })
}))


exports.verifyUser = passport.authenticate('jwt', {session : false})