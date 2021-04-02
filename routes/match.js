var express = require('express');
var bodyParser = require('body-parser');
var cors = require('./cors');
var mysql = require('mysql');



var matchRouter = express.Router();
matchRouter.use(bodyParser.json());

matchRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.post(cors.corsWithOptions,(req,res,next)=>{
    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:req.body.db
    });

    var sql = `SELECT * FROM ${req.body.table1} ${req.body.type} ${req.body.table2} ON ${req.body.table1}.${req.body.col1} 
                                                = ${req.body.table2}.${req.body.col2}`;

    con.query(sql,function(err,result){
        if(err){
            next(errr);
        }

        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    })
})

module.exports = matchRouter;