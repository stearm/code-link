var express = require('express');
var cors = require('cors');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

require('./secure/strategy')(passport);
app.use(session({
    secret: "s3cr37",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

var api = require('./routes/api');

app.use('/api/', api);

app.get('/', function(req, res, next) {
  res.render('index.html');
});

app.get('/login', function(req, res, next) {
  res.render('login.html');
});

app.get('/error', function(req, res, next) {
  res.render('error.html');
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/error'
  })
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(3000, function(){
  var host = 'localhost';
  console.log('App listening at http://%s:%s', host, 3000);
});

module.exports = app;
