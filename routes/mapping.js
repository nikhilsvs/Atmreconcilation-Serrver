var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('./cors');
var mappingRouter = express.Router();

mappingRouter.use(bodyParser.json());
mappingRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.post(cors.corsWithOptions,(req,res,next)=>{

    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:'atmrecon',
        multipleStatements:true
    });

    var sql = `create table ${req.body.tname} as (select `;
    var sql2 = `create table ${req.body.tname}_unreco as (select `;

    let n = req.body.cols.length;
    req.body.cols.forEach((item,idx)=>{
        sql += item ;
        sql2 += item ;

        if(idx<n-1)
        {
            sql += ", ";
            sql2 += ", " ;
        }
    });

    sql += `from ${req.body.t1}, ${req.body.t2} limit 0)`;
    sql2 += `from ${req.body.t1}, ${req.body.t2} limit 0)`;

    sql += "; "+sql2;
    console.log(sql);
    con.query(sql,(err,result)=>{
        if(err){
            next(err);
        }

        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    });

    con.end();
});

module.exports = mappingRouter;
