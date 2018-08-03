
var express = require('express');
var router = express.Router();
var dbservice = require('./dbservice');


router.get('/', function(req, res, next) {
   dbservice.showAlltoDelete(req, res)
});

router.post('/', function(req, res, next) {
    dbservice.deleteQuestion(req, res)
});




module.exports= router;