var express = require('express');
const bodyParser = require('body-parser')
const User = require('../models/users')

var router = express.Router();
router.use(bodyParser.json())

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {

  const data = req.body
  console.log('data', data)
  User.findOne({username : data.username})
    .then((user) => {
      if(user !== null){
        const err = new Error('User ' + data.username + ' already exists')
        err.status = 403
        next(err)
      }
      else{
        return User.create({
          username : data.username,
          password : data.password
        })
      }
    })
    .then(user => {
      res.statusCode = 200
      res.setHeader('Content-Type' , 'application/json')
      res.json({status : 'Registeration successfull', user : user})
    }, (err) => next(err))
    .catch((err) => next(err))
})

router.post('/login', (req, res, next) => {

  const sessionHeader = req.session
  if ( !sessionHeader.user ) {
    let authHeader = req.headers.authorization
    console.log('auth', authHeader)
    if (!authHeader) {

      console.log('here')
      let err = new Error ("You are not authenticated!!")
      res.setHeader('WWW-Authenticate', 'Basic')
      err.status = 401
      return next(err)
    }
    let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
    const username = auth[0]
    const password = auth[1]
    console.log('user', username)
    console.log('pass', password)

    User.findOne({username : username})
      .then((user) => {
        if (user === null) {
          let err = new Error ("User : " + user.username +" not found!!")
          res.setHeader('WWW-Authenticate', 'Basic')
          err.status = 401
          return next(err)
        }
        else if (user.password !== password){
          let err = new Error ("Your password is incorrect")
          res.setHeader('WWW-Authenticate', 'Basic')
          err.status = 401
          return next(err)
        }
        else if(user.username === username && user.password === password){
          // res.cookie('user', 'admin', {signed : true})
          req.session.user = "authenticated"
          res.statusCode = 200
          res.setHeader("Content-Type", 'text/plain')
          res.end("You are authenticated")    
        }
      }) 
      .catch((err) => next(err))
  }
  else {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end("You are authenticated")
  }

})


router.get('/logout', (req ,res , next) => {

  if ( req.session ){
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect('/')
  }
  else{
    let err = new Error ("Your are not logged in!")
    err.status = 403
    return next(err)
  }

})


module.exports = router;
