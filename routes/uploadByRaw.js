var express = require('express');
var bodyParser = require('body-parser');
var lineReader = require('line-reader');
var mysql = require('mysql');
var cors = require('./cors');


var rawRouter = express.Router();

rawRouter.use(bodyParser.json())
rawRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.post(cors.corsWithOptions,(req,res,next)=>{

    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:'atmrecon'
    });

    let values= [];
    console.log(req.body.info);
    lineReader.eachLine(`public/files/${req.body.filename}`,(line,last)=>{
        var temp = req.body.info.map((item,i)=>{
            return(
                line.substr(item.start-1,item.len)
            )
        })
        temp.push(`${req.body.filename}`);
        values.push(temp);

        if(last){
            console.log(values);
            var sql = `insert into ${req.body.tname} values ?`
            con.query(sql,[values],(err,result)=>{
                if(err){
                    next(err);
                }
                console.log(sql);
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                console.log(JSON.stringify(result));
                res.json(result);
            })
        }
    })

})

module.exports = rawRouter;
