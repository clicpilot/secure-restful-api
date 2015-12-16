var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var config = require('../../config');

var User = require('../models/user');
var BusinessInfo = require('../models/businessInfo');

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
        var business = req.body.business || '';

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
                    // Then first create business info

                    var businessInfo = new BusinessInfo();
                    businessInfo.storeName = business.storeName;
                    businessInfo.bio = business.bio;
                    businessInfo.photoUrl = business.photoUrl;
                    businessInfo.phone = business.phone;
                    businessInfo.email = business.email;
                    businessInfo.address = business.address;
                    businessInfo.latitude = business.latitude;
                    businessInfo.longtitude = business.longtitude;

                    businessInfo.save(function(err,bsns) {

                        if(err) {
                            // Send: Bad Request
                            res.status(400).send();
                        }

                        // Business is created successfully
                        // Now create a user
                        if(role == "store"){
                            var user = new User();

                            user.username = username;
                            user.role = role;
                            user.profile = profile;


                            bcrypt.hash(password, 10, function (err, hash) {
                                user.password = hash;
                                user.businessId = bsns._id;

                                // Save the user
                                user.save(function(err,user) {

                                    if(err) {

                                        // if user cannot be saved then remove the business
                                        bsns.remove().exec();

                                        // Send: Bad Request
                                        res.status(400).send();
                                    }

                                    // If everything is OK, send 201
                                    res.status(201).send();
                                });
                            });
                        }else if(role == "driver"){
                            // TODO: Create driver


                        }
                        else if(role == "admin"){
                            // TODO: Create driver


                        }

                    });

                }
                else{
                    // User already exist - Send Conflict Http: 409
                    res.status(409).send();
                }
            });

    },

    validateUser: function(username, callback) {

        process.nextTick(function(){
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