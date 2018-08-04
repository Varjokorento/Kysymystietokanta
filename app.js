var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const axios = require('axios');
const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;


// configure passport.js to use the local strategy

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        axios.get(`http://localhost:5000/users?email=${email}`)
            .then(res => {
                console.log("maybe axios?");
                const user = res.data[0]
                if (!user) {
                    return done(null, false, { message: 'Invalid credentials.\n' });
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, { message: 'Invalid credentials.\n' });
                }
                return done(null, user);
            })
            .catch(error => done(error));
    }
));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    axios.get(`http://localhost:5000/users/${id}`)
        .then(res => done(null, res.data) )
        .catch(error => done(error, false))
});
//




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var palauteRouter = require('./routes/palaute')
var allQuestionsRouter = require('./routes/allquestions');
var deleteRouter = require('./routes/deletequestions');
var loginRouter = require('./routes/login');


var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// configure passport.js to use the local strategy



app.use(session({
    genid: (req) => {
        console.log("session?")
        return uuid() // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    secure: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());


//passport testiausta

app.get('/megalogin', (req, res) => {
    console.log(`User authenticated? ${req.isAuthenticated()}`)
    console.log('Inside GET /login callback function')
    console.log(req.sessionID)
    res.send(`You got the login page!\n`)
})

app.post('/megalogin', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(info) {return res.send(info.message)}
        if (err) {return next(err); }
        if (!user) { return res.send('no'); }
        req.login(user, (err) => {
            if (err) { return next(err); }
            res.send("Auto");
        })
    })(req, res, next);
});

app.get('/authrequired', (req, res) => {
    console.log('Inside GET /authrequired callback')
    console.log(`User authenticated? ${req.isAuthenticated()}`)
    if(req.isAuthenticated()) {
        res.send('you hit the authentication endpoint\n')
    } else {
        res.send("no!");
    }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/allquestions', allQuestionsRouter);
app.use('/palaute', palauteRouter);
app.use('/deleteQuestions', deleteRouter);
app.use('/login', loginRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
