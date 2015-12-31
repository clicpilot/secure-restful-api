var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var config = require('../../config');
var sendgrid  = require('sendgrid')

var User = require('../models/user');

var auth = {

    login: function(req, res) {

        var username = req.body.username || '';
        var password = req.body.password || '';


        // If user or password, credentials error
        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        // First find the user
        User.findOne({username: username})
            .select('+password')// select all fields but additionaly password, because its select = false in the model
            .exec(function (err, user) {

                // If error exists or user could't be found
                if (err || !user) {
                    res.status(401);
                    res.json({
                        "status": 401,
                        "message": "Invalid credentials"
                    });
                    return;
                }

                // Decrypt and compare the user password
                bcrypt.compare(password, user.password, function (err, valid) {

                    if (err || !valid) {
                        res.status(401);
                        res.json({
                            "status": 401,
                            "message": "Invalid credentials"
                        });
                        return;
                    }

                    var token = generateToken(user);

                    // Send OK
                    res.status(200).send(token);
                });
            });


    },


    register: function(req, res){
        var username = req.body.user.username || '';
        var password = req.body.user.password || '';
        var role = req.body.user.role || '';
        var profile = req.body.user.profile || '';

        var business = req.body.user.business || '';
        var carDriver = req.body.user.carDriver || '';

        // If user or password, credentials error
        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        User.findOne({username: username})
            .select('username')
            .exec(function (err, user) {

                if(!user){
                    // User does not exist
                    var user = new User();

                    user.username = username;
                    user.role = role;
                    user.profile = profile;

                    if(role == "store") {
                        if(business) {
                            user.business = business;
                        } else {
                            // A store user should have business info
                            res.status(404).json({
                                "status": 404,
                                "message": "A store user should have business info"
                            });

                            return;
                        }
                    } else if(role == "driver") {
                        if(carDriver) {
                            user.carDriver = carDriver;
                        } else {
                            // A driver user should have car&driver details
                            res.status(404).json({
                                "status": 404,
                                "message": "A driver user should have car&driver details"
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
                                res.status(400).send();
                            }

                            // If everything is OK, send 201
                            res.status(201).send();
                        });
                    });


                } else {

                    console.log(user);


                    // User already exist - Send Conflict Http: 409
                    res.status(409).send();
                }
            });

    },

    /** This method manages the forgotten password  */
    forgot: function(req, res) {
        var username = req.body.username || '';

        // If user or password, credentials error
        if (username == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        User.findOne({username: username})
            .exec(function (err, user) {
                if(err) {
                    res.status(401);
                    res.json({
                        "status": 401,
                        "message": "Invalid credentials"
                    });
                    return;
                }

                if(user) {
                    var mail = sendgrid(config.sendgridApiKey);

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
                } else {
                    res.status(401);
                    res.json({
                        "status": 401,
                        "message": "Invalid credentials"
                    });
                    return;
                }



            });
    },

    validateUser: function(username, callback) {

        process.nextTick(function() {
            User.findOne({username: username})
                .exec(function (err, user) {

                    callback(err, user);
                });
        });


    },
};

// This method generates JWT string using username
function generateToken(user) {
    var expires = expiresIn(7); // 7 days

    // Put username into encoded string, not password
    var token = jwt.encode({
        exp: expires,
        username: user.username,
        userId: user._id,
        businessId: user.businessId,
    }, config.secret);

    // return token, expiration date and username
    return {
        token: token,
        expires: expires,
        username: user.username
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;