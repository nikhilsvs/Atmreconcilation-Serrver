const cors = require('cors');
const express = require('express');
const ip = require('ip');

const app = express();

const whitelist = ['http://localhost:3001','http://localhost:3000',
                    `http://${ip.address()}:3000`,`http://${ip.address()}:3001`];

var corsOptionsDelegate = (req,callback)=>{
    var corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        corsOptions = { origin:true };
    }
    else{
        corsOptions = {origin:false};
    }
    callback(null,corsOptions);

};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
