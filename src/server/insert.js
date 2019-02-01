
'use strict'; // http://www.w3schools.com/js/js_strict.asp
// web framework
var connect = require('./insert');
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
app.use( bodyParser.json());

bodyParser = {
    json: {limit: '500mb', extended: true},
    urlencoded: {limit: '500mb', extended: true}
  };
//////////////////////////////////////////////////
////Connection MySQL
//////////////////////////////////////////////////
// connect to MySQL hosted on Amazon RDS
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: '140.112.12.103',
    user: 'iot',
    password: '',
    database: 'iottest'
});
connection.connect();

///////////////////////////////////////////////////
///////////////////////////////////////////////////

// wait for database
router.post('/user/insert', function (req, res) {
	
var db = connection;
var data = req.body.search;
db.query("INSERT INTO image (base64) values (?)",[data], function (error, rows, fields) {
    if (error) {console.log(error);	throw error;}
    
    else{
        
        res.redirect('/');
    }
    
    
});


});
module.exports = router;