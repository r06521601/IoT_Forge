
'use strict'; // http://www.w3schools.com/js/js_strict.asp
// web framework
var connect = require('./connect');
var express = require('express');
var router = express.Router();

//////////////////////////////////////////////////
////Connection MySQL
//////////////////////////////////////////////////
// connect to MySQL hosted on Amazon RDS
const mysql = require('mysql');


///////////////////////////////////////////////////
///////////////////////////////////////////////////

// wait for database
router.get('/user/connect', function (req, res) {
	var connection = mysql.createConnection({
    host: '140.112.12.103',
    user: 'iot',
    password: '',
    database: 'iottest'
});
connection.connect();
var db = connection;
var data = "";
db.query('SELECT * FROM `iott` ORDER BY name DESC LIMIT 10', function (error, rows, fields) {
	if (error) {console.log(error);	throw error;}
	var data = rows[0];
	
	res.json({rows});
});


});

module.exports = router;