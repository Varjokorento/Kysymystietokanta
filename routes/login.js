var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';

var express = require('express');
var router = express.Router();



router.get('/', function(req, res, next) {
    res.render('login', {error: ""});
});




module.exports= router;