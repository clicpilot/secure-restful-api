var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose   = require('mongoose');
var config = require('./config');

// Connect to database specified in the config
mongoose.connect(config.databaseURI[app.settings.env]);

// Log for development
app.use(logger('dev'));

// Get the data from a POST in JSON format
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

// Listen 8080
var port = process.env.PORT || 8080;

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening ' + port);

module.exports = app;