var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('./cors');


var splitRouter = express.Router();

splitRouter.use(bodyParser.json());

splitRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.post(cors.corsWithOptions,(req,res,next)=>{

    var con = mysql.createConnection({
        host:"localhost",
        user:'root',
        password:'MySql@98',
        database:req.body.db
    })

    var sql = `alter table ${req.body.tname} add column ${req.body.newCol} ${req.body.dtype}(${req.body.len})`;
    console.log("Sql1 : " + sql);
    con.query(sql,(err,result)=>{
        if(err){
            next(err);

        }
        else
        {
            var sql2 = `update ${req.body.tname} set ${req.body.newCol} = substring(${req.body.splitCol},${req.body.startPos},${req.body.endPos-req.body.startPos+1})`;
            console.log("Sql2 : " + sql2);
            con.query(sql2,(err,result)=>{
                if(err){
                    next(err);
                }
        
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(result);
            })
        }
    })
  

})

module.exports = splitRouter;