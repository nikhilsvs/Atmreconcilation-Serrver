var express = require('express');
var mysql = require('mysql');
var reconcileRouter = express.Router();
var bodyParser = require('body-parser');
var cors = require('./cors');

reconcileRouter.use(bodyParser.json());
reconcileRouter.route('/:tname')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.post(cors.corsWithOptions,(req,res,next)=>{

    var con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'vinod',
        database:'atmrecon',
        multipleStatements: true
    });

    var sql = `insert into ${req.params.tname} (select `;
    var sql2 = `insert into ${req.params.tname} (select `;
    var unmatchsql = `insert into ${req.params.tname}_unreco (select `;
    var unmatchsql2 = `insert into ${req.params.tname}_unreco (select `;
    let n = req.body.cols.length;
    req.body.cols.forEach((item,idx)=>{
        if(item.col1 != '' && item.col2 != '')
        {
            sql += `${req.body.file1}.\`${item.col1}\` `;
            sql2 += `${req.body.file2}.\`${item.col2}\` `;
            unmatchsql += `${req.body.file1}.\`${item.col1}\` `;
            unmatchsql2 += `${req.body.file2}.\`${item.col2}\` `;
        }
        
        else if(item.col1 == ''){
            sql += "\" \" ";
            sql2 += `${req.body.file2}.\`${item.col2}\` `;
            unmatchsql += "\" \" ";
            unmatchsql2 += `${req.body.file2}.\`${item.col2}\` `;
        }
        else{
            sql += `${req.body.file1}.\`${item.col1}\` `;
            sql2 += "\" \" ";
            unmatchsql += `${req.body.file1}.\`${item.col1}\` `;
            unmatchsql2 += "\" \" ";
        }

        if(idx<n-1){
            sql += ',';
            sql2 += ',';
            unmatchsql += ',';
            unmatchsql2 += ',';
        }

    });



    sql += `, ${req.body.file1}.\`filename\`,"${req.body.file1}" as filetype from ${req.body.file1},${req.body.file2} where `;
    sql2 += `, ${req.body.file2}.\`filename\`,"${req.body.file2}" as filetype from ${req.body.file1},${req.body.file2} where `;
    unmatchsql += `, ${req.body.file1}.\`filename\`,"${req.body.file1}" as filetype from ${req.body.file1} where `;
    unmatchsql2 += `, ${req.body.file2}.\`filename\`,"${req.body.file2}" as filetype from ${req.body.file2} where `;

    sql += `${req.body.file1}.\`${req.body.exactMatchh.col1}\` = ${req.body.file2}.\`${req.body.exactMatchh.col2}\` `
    sql2 += `${req.body.file1}.\`${req.body.exactMatchh.col1}\` = ${req.body.file2}.\`${req.body.exactMatchh.col2}\` `;

    if(req.body.amap1 != '')
    {
        if(req.body.apply1 == 'Both')
        {
            sql += "and " + req.body.amap1;
            sql2 += "and " + req.body.amap1;
           
        }
        else if(req.body.apply1 == req.body.file1)
        {
            sql += "and " +req.body.amap1;
        }
        else{
            sql2 += "and " + req.body.amap1;
        }
       
    }
    if(req.body.amap2 != '')
    {
        if(req.body.apply2 == 'Both')
        {
            sql += "and " +req.body.amap2;
            sql2 += "and " +req.body.amap2;
            
        }
        else if(req.body.apply2 == req.body.file1)
        {
            sql += "and " +req.body.amap2;
        }
        else{
            sql2 += "and " +req.body.amap2;
        }
      
    }
    if(req.body.amap3 != '')
    {
        if(req.body.apply3 == 'Both')
        {
            sql += "and " +req.body.amap3;
            sql2 += "and " +req.body.amap3;
          
        }
        else if(req.body.apply3 == req.body.file1)
        {
            sql += "and " +req.body.amap3;
        }
        else{
            sql2 += "and " +req.body.amap3;
        }

    }


    sql += `and concat(${req.body.file1}.\`filename\`,${req.body.file1}.\`${req.body.uval1}\`) not in (select concat(filename,\`${req.body.uval1}\`) from ${req.params.tname} where filetype = "${req.body.file1}") )`
    sql2 += `and concat(${req.body.file2}.\`filename\`,${req.body.file2}.\`${req.body.uval2}\`) not in (select concat(filename,\`${req.body.uval2}\`) from ${req.params.tname}  where filetype = "${req.body.file2}") )`;
    unmatchsql += ` concat(${req.body.file1}.\`filename\`,${req.body.file1}.\`${req.body.uval1}\`) not in (select concat(filename,\`${req.body.uval1}\`) from ${req.params.tname} where filetype = "${req.body.file1}") )`
    unmatchsql2 += ` concat(${req.body.file2}.\`filename\`,${req.body.file2}.\`${req.body.uval2}\`) not in (select concat(filename,\`${req.body.uval2}\`) from ${req.params.tname}  where filetype = "${req.body.file2}") )`;
    console.log(sql);
    console.log(sql2);
    console.log(unmatchsql);
    console.log(unmatchsql2);
    sql += "; " + sql2 +"; "+unmatchsql + "; "+unmatchsql2;
    con.query(sql,(err,result)=>{
        if(err){
            next(err);
        }

       console.log(result);
       res.statusCode = 200;
       res.setHeader('Content-Type','application/json');
       res.json(result);
    });
    
    con.end();

})

module.exports = reconcileRouter;