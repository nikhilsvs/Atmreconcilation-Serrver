var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('./cors');

var configRouter = express.Router();
configRouter.use(bodyParser.json());

configRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.post(cors.corsWithOptions,(req,res,next)=>{

    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:'configuredTables'
    });

    var sql = `create table ${req.body.tname}_Configured (name varchar(100),datatype varchar(20),len int(10),start int(10))`;
    con.query(sql,(err,result)=>{
        if(err){
            next(err);
        }

        var a = [];
        console.log(sql);
        console.log(result);
        for(var i = 0;i<req.body.inputFields.length;i++)
        {
            var temp = Object.values(req.body.inputFields[i]);
            a.push(temp);
        }


        console.log(a);
        var sql2 = `insert into ${req.body.tname}_Configured values ?`;

        con.query(sql2,[a],(err,result)=>{
            if(err){
                next(err);
            }

            console.log(result);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(result);
        })

    })

})


module.exports = configRouter;