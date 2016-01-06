var jwt         = require('jwt-simple');
var bcrypt      = require('bcrypt');
var config      = require('../../config');
var sendgrid    = require('sendgrid')
var User        = require('../models/user');

/**
 * Routers for authentication: /login, /register, /password
 * @type {{login: auth.login, register: auth.register, forgot: auth.forgot, validateUser: auth.validateUser}}
 */
var auth = {
    /**
     * /login endpoint
     * @param req request having http body should have username and password
     * @param res response having token data including username and role
     */
    login: function(req, res) {
        var username = req.body.username || '';
        var password = req.body.password || '';

        // If user or password, credentials error
        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Unauthorized: Invalid credentials"
            });
            return;
        }

        // Find the user
        User.findOne({username: username})
            .select('+password')// select all fields but additionaly password, because its select = false in the model
            .exec(function (err, user) {

                // If error exists or user could't be found
                if (err || !user) {
                    res.status(401);
                    res.json({
                        "status": 401,
                        "message": "Unauthorized: Invalid credentials"
                    });
                    return;
                }

                // Decrypt and compare the user password
                bcrypt.compare(password, user.password, function (err, valid) {
                    if (err || !valid) {
                        res.status(401);
                        res.json({
                            "status": 401,
                            "message": "Unauthorized: Invalid credentials"
                        });
                        return;
                    }

                    // Generate token using JWT
                    var tokenData = generateToken(user);

                    // Send OK
                    res.status(200).send(tokenData);
                });
            });
    },

    /**
     * /register endpoint
     * @param req request having all information for either store or driver
     * @param res response having only http status code (201: User Created, 409: User Already Exist)
     */
    register: function(req, res){
        var username =  req.body.username   || '';
        var password =  req.body.password   || '';
        var role =      req.body.role       || '';
        var profile =   req.body.profile    || '';
        var business =  req.body.business   || '';
        var carDriver = req.body.carDriver  || '';

        // If user or password, credentials error
        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Unauthorized: Invalid credentials"
            });
            return;
        }

        // Find the user
        User.findOne({username: username})
            .select('username')
            .exec(function (err, user) {

                // If user does not exist, create user
                if(!user){
                    // Create the user
                    var user = new User();
                    user.username = username;
                    user.role = role;
                    user.profile = profile;

                    if(role == "store") {
                        // If business information exist
                        if(business) {
                            user.business = business;
                        } else {
                            // A store user should have business info
                            res.status(404).json({
                                "status": 404,
                                "message": "Not Found: A store user should have business info"
                            });

                            return;
                        }
                    } else if(role == "driver") {
                        // if driver & car information exist
                        if(carDriver) {
                            user.carDriver = carDriver;
                        } else {
                            // A driver user should have car&driver details
                            res.status(404).json({
                                "status": 404,
                                "message": "Not Found: A driver user should have car&driver details"
                            });
                            return;
                        }
                    }

                    // Hash the password
                    bcrypt.hash(password, 10, function (err, hash) {
                        user.password = hash;

                        // Save the user
                        user.save(function(err,user) {

                            if (err) {
                                // Send: Bad Request
                                res.status(500).json({
                                    "status": 500,
                                    "message": "Internal Error: User can not be registered"
                                });
                                return;
                            }

                            // If everything is OK, send 201
                            res.status(201).json({
                                "status": 201,
                                "message": "Created: User is successfully registered"
                            });
                            return;
                        });
                    });

                } else {
                    res.status(409).json({
                        "status": 409,
                        "message": "Conflict: User already exist"
                    });
                    return;
                }
            });
    },

    /**
     * /forgot endpoint
     * @param req request having username(e-mail) of the user
     * @param res response http status codes
     */
    forgot: function(req, res) {
        // user email
        var username = req.body.username || '';

        // If user or password, credentials error
        if (username == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Unauthorized: Invalid credentials"
            });
            return;
        }

        // Find the user
        User.findOne({username: username})
            .exec(function (err, user) {
                if(err) {
                    res.status(500).json({
                        "status": 500,
                        "message": "Internal Error: User cannot be found"
                    });
                    return;
                }

                // If user exist
                if(user) {
                    // TODO: Add to worker queue
                    var mail = sendgrid(config.sendgridApiKey);

                    // TODO: Add password reset mechanism
                    /*
                    mail.send({
                        to:       username,
                        from:     'no-reply@mapia.com',
                        subject:  'Password reset',
                        text:     'Password reset e-mail.'
                    }, function(err, json) {

                        if (err) {
                            res.status(500);
                            res.json({
                                "status": 500,
                                "message": "Internal error"
                            });
                            return;
                        }

                        res.status(200).send(json);
                    });
                    */
                    res.status(200).send();

                } else {
                    res.status(404).json({
                        "status": 404,
                        "message": "Not Found: User cannot be found"
                    });
                }
            });
    },

    /**
     * This is an async method to find the user from database
     * @param username email of the user
     * @param callback The callback passing the result of db query
     */
    validateUser: function(username, callback) {
        process.nextTick(function() {
            User.findOne({username: username})
                .exec(function (err, user) {
                    callback(err, user);
                });
        });
    },
};

/**
 * This method generates JWT string using username
 * @param user
 * @returns {{token: String, expires, username: *, role: (*|UserSchema.role|{type, required}|string|string|string)}}
 */
function generateToken(user) {
    var expires = expiresIn(config.dayForTokenExpiration); // 7 days

    // TODO: This is encoded but not encrypted, Encrypt it!
    var token = jwt.encode({
        exp: expires,
        username: user.username,
        userId: user._id,
        role: user.role
    }, config.secret);

    // return token, expiration date, username and role
    return {
        token: token,
        expires: expires,
        username: user.username,
        role: user.role
    };
}

/**
 * Adds numDates to current data&time
 * @param numDays
 * @returns {Date}
 */
function expiresIn(numDays) {
    var dateObj = new Date();
    // Add date
    dateObj = dateObj.setDate(dateObj.getDate() + numDays);

    return dateObj;
}

module.exports = auth;