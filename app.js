var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var databaseRouter = require('./routes/databases');
var uploadRouter = require('./routes/uploadRouter');
var router = require('./routes/uploadByDelimited');
var rawRouter = require('./routes/uploadByRaw');
var matchRouter = require('./routes/match');
var splitRouter = require('./routes/splitColumn');
var configRouter = require('./routes/configureTable');
var mappingRouter = require('./routes/mapping');
var reconcileRouter = require('./routes/reconcilation');
var tableDataRouter = require('./routes/tableData');
var mongoose = require('mongoose');
var app = express();
var config = require('./config');
var passport = require('passport');
var cors = require('cors');

const connect = mongoose.connect(config.url,{ useNewUrlParser: true ,useUnifiedTopology: true});
connect.then((db)=>{
  console.log("Connected To MongoDb : " + db);
},(err)=>{
  console.log(err);
})

var con = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'vinod'
});

con.connect(function(err){
  if(err)
  console.log(err);
  else
  console.log('DataBase Connected');
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/databases',databaseRouter);
app.use('/fileupload',uploadRouter);
app.use('/uploadByDelimited',router);
app.use('/uploadByRaw',rawRouter);
app.use('/match',matchRouter);
app.use('/splitColumn',splitRouter);
app.use('/configureTable',configRouter);
app.use('/mapping',mappingRouter);
app.use('/reconcilation',reconcileRouter);
app.use('/getdata',tableDataRouter);
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
