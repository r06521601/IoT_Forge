
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
var connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
});
connection.connect();

///////////////////////////////////////////////////
///////////////////////////////////////////////////

// wait for database
router.get('/user/connect', function (req, res) {
	
var db = connection;
var data = "";
db.query('SELECT * FROM `iott` ORDER BY name DESC LIMIT 10', function (error, rows, fields) {
	if (error) {console.log(error);	throw error;}
	var data = rows[0];
	
	res.json({rows});
});


});

module.exports = router;
