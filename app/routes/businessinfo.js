/**
 * Created by hhtopcu on 16/12/15.
 */
var mongoose    = require('mongoose');
var User        = require('../models/user');

/**
 * Routers for Business Info GET and PUT
 * @type {{getOne: routers.getOne, update: routers.update}}
 */
var routers = {
    /**
     * Get single instance of booking
     * @param req request having business info ID
     * @param res response having a single instance of Business Info
     */
    getOne: function(req, res) {
        // Check if id of business info passed with the request valid for MongoDB or not
        var isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

        if (isIdValid) {
            // Convert string typed id to ObjectId compatible with MongoDB
            var id = mongoose.Types.ObjectId(req.params.id);

            // Find the user by user id
            User.findOne({'business._id': id})
                .select('business')
                .exec(function (err, data) {
                    if (err || !data) {
                        res.status(500).json({
                            "status": 500,
                            "message": "Internal error: The Business Info cannot be found"
                        });
                        return;
                    }

                    res.status(200).json(data.business);
                });
        } else {
            res.status(404).json({
                "status": 404,
                "message": "Not Found: The Business Info cannot be found"
            });
            return;
        }
    },

    /**
     * Update an existing Business Info
     * @param req request having business info ID
     * @param res response having only the resulting http status code
     */
    update: function(req, res) {
        // Check if id of business info passed with the request valid for MongoDB or not
        var isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

        if (isIdValid) {
            // Convert string typed id to ObjectId compatible with MongoDB
            var id = mongoose.Types.ObjectId(req.params.id);

            // Get the updated business info
            var business = req.body.business || '';

            // Update the business info
            User.update({'business._id': id},
                {
                    $set: {
                        'business.storeName': business.storeName,
                        'business.bio': business.bio,
                        'business.photoUrl': business.photoUrl,
                        'business.photoMd5': business.photoMd5,
                        'business.phone': business.phone,
                        'business.email': business.email,
                        'business.storeName': business.storeName,
                    }
                }, function (err) {
                    if (err) {
                        res.status(500).json({
                            "status": 500,
                            "message": "Internal error: The Business Info cannot be updated"
                        });
                        return;
                    }

                    res.status(201).json({
                        "status": 201,
                        "message": "Created: Business Info is updated"
                    });
                });
        } else {
            res.status(404).json({
                "status": 404,
                "message": "Not Found: The Business Info cannot be found"
            });
            return;
        }
    },
};

module.exports = routers;
