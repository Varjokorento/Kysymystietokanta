
var express = require('express');
var router = express.Router();
var dbservice = require('./dbservice');




router.get('/', function (req, res, next) {
   dbservice.showAll(req, res)
});


router.post('/parameters', function(req, res, next) {
   if(req.body.questiongenre !== "showall") {
       dbservice.showAllwithParameters(req, res)
   } else {
      dbservice.showAll(req, res)
   }
});



module.exports= router;