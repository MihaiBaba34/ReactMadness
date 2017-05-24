'use strict';
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser')
var crypto = require('crypto');
var async = require('async');
var cheerio = require('cheerio');
var mysql = require('mysql');

var app = express();
var rootDir = __dirname + '/public';
var portid = 8080; // HTTP listening port number
var sess;
var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'react_madness'
});

app.use(express.static(rootDir));
app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: false,
    resave: false
}));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.listen(portid, function () {
    console.log("Server running at http://localhost:" + portid); 
});
