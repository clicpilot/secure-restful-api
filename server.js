// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose   = require('mongoose');
var config = require('./config');

// Connect to database specified in the config
//mongoose.connect(config.database);
mongoose.connect(config.databaseURI[app.settings.env]);


// Logger for development
app.use(logger('dev'));

// this will let us get the data from a POST in JSON format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable Cross Origin Resource Sharing
app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token');

    // Enable Client-side caching (private means only the client will store the information)
    res.header('Cache-Control', 'private, max-age=31557600'); // one year

    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed
app.all('/v1/*', [require('./app/middlewares/validateRequest')]);

// Register our routes: /app/routes/index.js
app.use('/', require('./app/routes'));

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
    res.status(404).sendFile(require('path').join(__dirname, 'static/404.html'));
});


var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

/*
 // middleware to use for all requests
 router.use(function(req, res, next) {
 // do logging
 console.log('A request has been done');
 next(); // make sure we go to the next routes and don't stop here
 });


 // test route to make sure everything is working (accessed at GET http://localhost:8080/)
 router.get('/', function(req, res) {
 res.json({ message: 'Welcome to our secure api' });
 });
 */

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening ' + port);

module.exports = app;