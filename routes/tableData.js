var express = require('express');
var bodyParser = require('body-parser');
var tableDataRouter = express.Router();
var mysql = require('mysql');
var cors = require('./cors');
tableDataRouter.use(bodyParser.json());

tableDataRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.post(cors.corsWithOptions,(req,res,next)=>{
    
    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:'atmrecon'
      });
    con.connect(function(err){
        if(err){
            next(err);
        }
        console.log("Connected");
        var sql = `select * from ${req.body.tname} where ${req.body.condition}`;
        console.log(sql);
        con.query(sql,function(err,result){
            if(err){
                next(err);
            }
            con.end();
            console.log(result);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(result);
          
        })
    })
})

module.exports = tableDataRouter;