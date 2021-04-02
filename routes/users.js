var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var authenticate = require('../authenticate');
var cors = require('./cors');
var router = express.Router();
var authenticate = require('../authenticate');
router.use(bodyParser.json());

/* GET users listing. */
router.options((req,res)=>{res.sendStatus(200);})
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',(req, res, next) => {
  User.register(new User({username: req.body.username}),
  req.body.password,(err,user)=>{
 
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err:err});
    }
    else {
      passport.authenticate('local')(req,res,()=>{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success:true,status: 'Registration Successful!'});
      });
    }
  });
});
router.post('/login', (req, res,next) => {

  passport.authenticate('local',(err,user,info) =>{
    if(err){
      return next(err);
    }
    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful',err:info});
    }
    req.logIn(user,(err)=>{
      if(err){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful!',err:'Could Not Login User'});
      }
      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, status: 'You are successfully logged in!'});
    });

  })(req,res,next);
 
});
router.get('/logout', (req, res,next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/checkJWTToken',(req,res)=>{
  passport.authenticate('jwt',{session:false},(err,user,info)=>{
    if(err){
      return next(err);
    }
    if(!user){
      res.statusCode=401;
      res.setHeader('Contenr-Type','application/json');
      res.json({status:'JWT Invalid',success:false,err:info});
    }
    else{
      res.statusCode=200;
      res.setHeader('Contenr-Type','application/json');
      res.json({status:'JWT valid',success:true,user:user});
    }
  })(req,res);
});


module.exports = router;