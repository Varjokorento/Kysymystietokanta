
var express = require('express');
var router = express.Router();
var dbservice = require('./dbservice');


router.get('/', function(req, res, next) {
   res.render("palaute")
});


router.get('/kiitospalautteesta', function(req, res, next) {
    res.render("kiitospalautteesta")
});

module.exports= router;