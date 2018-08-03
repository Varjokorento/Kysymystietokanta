var express = require('express');
var router = express.Router();
var dbservice = require('./dbservice');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
  dbservice.addQuestiontotheDatabase(req, res);
})

module.exports = router;
