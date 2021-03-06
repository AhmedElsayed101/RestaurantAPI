var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const passport = require('passport')
const authenticate = require('./authenticate')
const config = require('./config')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRouter');
const dishRouter = require('./routes/dishRouter')
const leaderRouter = require('./routes/leadersRouter')
const promotionRouter = require('./routes/promotionsRouter')
const uploadRouter = require('./routes/uploadRouter')
const favoriteRouter = require('./routes/favoritesRouter')
// const { Buffer } = require('buffer');
const dbUrl = config.mongoUrl
const connect = mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true ,useCreateIndex : true,})

connect.then((db) => {
  console.log('Connected to the db server !')
}, (err) => console.log('err', err))


var app = express();

app.all('*', (req, res ,next) => {
  if (req.secure){
    console.log('here')
    return next()
  }
  else{
    console.log('heeeere')
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url)
  }
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(passport.initialize())


app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter)
app.use('/leaders', leaderRouter)
app.use('/promotions', promotionRouter)
app.use('/imageUpload', uploadRouter)
app.use('/favorites', favoriteRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
