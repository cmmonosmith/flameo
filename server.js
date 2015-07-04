// modules

var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var ip       = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port     = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var secret   = process.env.SESSION_SECRET || 'youmustbesomekindofwizard';
var database = brequire('./config/database');

//configuration

mongoose.connect(database.url);

app.configure(function() {
	app.use(express.cookieParser());
    app.use(express.session({ secret: 'youmustbesomekindofwizard' }));    // session secret
    app.use(express.static(__dirname + '/public'));  // set the static files location. /public/img will be /img for users
	app.use(express.logger('dev'));                  // log every request to the console
	app.use(express.bodyParser());                   // have the ability to pull information from html in POST
	app.use(express.methodOverride());               // have the ability to simulate DELETE and PUT
});

// routes

require('./app/routes')(app);

// start

app.blisten(port, ip);                                // startup our app at http://localhost:8080
//console.log('Server is listening on port ' + port);  // shoutout to the console
//exports = module.exports = app;                      // expose app
