var express = require('express');
var bodyParser = require('body-parser');
var databaseRouter = express.Router();
var mysql = require('mysql');
var cors = require('./cors');
databaseRouter.use(bodyParser.json());

databaseRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.corsWithOptions,(req,res,next)=>{
    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:'configuredtables'
      });
    con.connect(function(err){
        if(err){
            next(err);
        }
        console.log("Connected");
        con.query("select distinct from entityformat",function(err,result){
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
.post(cors.corsWithOptions,(req,res,next)=>{
    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod'
      });
    con.connect(function(err){
        if(err){
            next(err);
        }
        console.log("Connected");
        var sql = 'create database ' + req.body.database;
        console.log(req.body.database);
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
databaseRouter.route('/entity')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.corsWithOptions,(req,res,next)=>{
    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:'configuredtables'
      });
    con.connect(function(err){
        if(err){
            next(err);
        }
        console.log("Connected");
        con.query("select distinct entity from entityformat",function(err,result){
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
databaseRouter.route('/format')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.corsWithOptions,(req,res,next)=>{
    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:'configuredtables'
      });
    con.connect(function(err){
        if(err){
            next(err);
        }
        console.log("Connected");
        con.query("select distinct format from entityformat",function(err,result){
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
databaseRouter.route('/:dname')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.put(cors.corsWithOptions,(req,res,next)=>{
    var con  = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
    })
    var sql = `mysqldump --databases ${req.params.dname} > public/db/db.sql`;
    console.log(sql);
    con.query(sql,(err,result)=>{
        if(err)
        next(err);

        console.log(result);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    })
})
.delete(cors.corsWithOptions,(req,res,next)=>{
    var con  = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
    })
    con.query('drop database '+ req.params.dname,(err,result)=>{
        if(err)
        next(err);

        console.log(result);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    })
})
databaseRouter.route('/:dname/tables')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.corsWithOptions,(req,res,next)=>{
    
    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:req.params.dname
    });
    con.connect(function(err){
        if(err)
        next(err);
        con.query('show tables',function(err,result,fields){
            if(err)
            next(err);

            console.log(result);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(result);
        });

    })
})
.post(cors.corsWithOptions,(req,res,next)=>{
    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:'atmrecon'
    });
    var sql = `create table ${req.body.tname}(`;
    var a = [];
    a = req.body.inputFields;
    console.log(req.body.tname);
    var n = a.length;
    for(var i = 0;i<n;i++)
    {
        var temp = ' ,';
        sql += `\`${a[i].name}\` ${a[i].datatype}(${a[i].len})`;
        sql += temp;
    }
    sql += `filename varchar(50)`
    sql += `)`;
    console.log(sql);
    con.query(sql,function(err,result){
        console.log(result);
        if(err)
        next(err);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    });
})
databaseRouter.route('/:dname/tables/:tname')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.corsWithOptions,(req,res,next)=>{
    
    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:req.params.dname
    });
    con.connect(function(err){
        if(err)
        next(err);
        let sql = `select * from ${req.params.tname}`;
        if(req.body.condition != null)
        {
            sql += `where ${req.body.condition}`;
        }
        con.query(sql,function(err,result,fields){
            if(err)
            next(err);

            console.log(result);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(result);
        });

    })
})
.post(cors.corsWithOptions,(req,res,next)=>{
    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:req.params.dname
    })
    var sql = `insert into ${req.params.tname} values ?`;

    con.query(sql,[req.body.values],function(err,result){
        if(err)
        next(err);

        console.log(result);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    });
    con.end();
})
.delete(cors.corsWithOptions,(req,res,next)=>{
    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:req.params.dname
    })
    var sql = `drop table ${req.params.tname}`;

    con.query(sql,function(err,result){
        if(err)
        next(err);

        console.log(result);
        res.statusCode = 200;
        res.setHeader('Content-Type','applicaation/json');
        res.json(result);
    })
})
.put(cors.corsWithOptions,(req,res,next)=>{
    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:req.params.dname
    })
    var sql = `rename table ${req.params.tname} to ${req.body.newname}`;

    con.query(sql,function(err,result){
        if(err)
        next(err);

        console.log(result);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    })
})
databaseRouter.route('/:dname/tables/:tname/desc')
.get(cors.corsWithOptions,(req,res,next)=>{
    
    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:req.params.dname
    });
    con.connect(function(err){
        if(err)
        next(err);
        con.query(`describe ${req.params.tname}`,function(err,result,fields){
            if(err)
            next(err);

            console.log(result);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(result);
        });

    })
})
module.exports = databaseRouter;