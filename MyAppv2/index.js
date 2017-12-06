var express = require('express');
var app = express();
var http = require("http");
var port = 8000;
var bodyParser = require("body-parser");

var mongoose = require("mongoose");
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var autoIncrement = require("mongoose-auto-increment");
var userinfoTotal = {};

var path = require("path");



var db = mongoose.connect('mongodb://appUser:password@ds133136.mlab.com:33136/planet-parenthood');
//var db = mongoose.connect('mongodb://localhost/connect');


var db = mongoose.connection; //var mconnection = mongoose.connect('mongodb://localhost/connect');

//initialize autoincrement function for comment id
autoIncrement.initialize(db);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});
app.use(session({
    secret: 'secret',
    resave: true,
    cookie: {
        secure: false,
        httpOnly: false
    },
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

app.use(function(req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

var routes = require('./router.js');
app.use('/', routes);
app.use("/www/html", express.static(__dirname + '/www/html'));
app.use("/www/css", express.static(__dirname + '/www/css'));
app.use("/www/media", express.static(__dirname + '/www/media'));
app.use("/www/js", express.static(__dirname + '/www/js'));
