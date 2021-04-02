var express = require('express');
var bodyParser = require('body-parser');
var cors = require('./cors');
var mysql = require('mysql');
var lineReader = require('line-reader');


var router = express.Router();
router.use(bodyParser.json());

router.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.post(cors.corsWithOptions,(req,res,next)=>{
    
       /* while(i<3)
        {
            values.push([`name${i+2}`,`roll${i+2}`,`college${i+2}`]);
            i++;
        }*/
        var con = mysql.createConnection({
            host:'localhost',
            user:'root',
            password:'vinod',
            database:'atmrecon'
        })
        var ans = {
            result:'ok'
        };
        var arr = [];
        lineReader.eachLine(`public/files/${req.body.file}`,(line,last)=>{
            //var arr = line.split(`${req.body.delimiter}`);
            
            arr.push(line.split(`${req.body.delimiter}`));
            
            
            
            if(last)
            {
                console.log(arr);
                var sql = `insert into ${req.body.tname} values ?`;
                
                con.query(sql,[arr],function(err,result){
                    if(err)
                        next(err);
                    console.log(result);
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(result);
                });
            }
            
            });

            

        });
    
        


module.exports = router;
