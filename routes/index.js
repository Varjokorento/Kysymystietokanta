var express = require('express');
var router = express.Router();
var dbservice = require('./dbservice');

function Authenticated(req, res, next) {
    // do any checks you want to in here

    if (req.isAuthenticated()) {
        return next();
    } else {

        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        res.redirect('/login');
    }
}

/* GET home page. */
router.get('/', Authenticated, function(req, res, next) {
    console.log(req.isAuthenticated());
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
  dbservice.addQuestiontotheDatabase(req, res);
})

module.exports = router;


