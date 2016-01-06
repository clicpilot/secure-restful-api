/**
 * Created by hhtopcu on 31/12/15.
 */
var mongoose    = require('mongoose');
var User        = require('../models/user');

/**
 * Routers for Car&Driver Detail GET and PUT
 * @type {{getOne: routers.getOne, update: routers.update}}
 */
var routers = {
    /**
     * Get single instance of Car&Driver Detail
     * @param req request having Car&Driver Detail ID
     * @param res response having a single instance of Car&Driver Detail
     */
    getOne: function(req, res) {
        // Check if id of Car&Driver detail passed with the request valid for MongoDB or not
        var isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

        if (isIdValid) {
            // Convert string typed id to ObjectId compatible with MongoDB
            var id = mongoose.Types.ObjectId(req.params.id);

            // Find the user by user id
            User.findOne({'carDriver._id': id})
                .select('carDriver')
                .exec(function (err, data) {

                    if ((err || !data)) {
                        res.status(500).json({
                            "status": 500,
                            "message": "Internal error: The Car&Driver Detail cannot be found"
                        });
                        return;
                    }

                    res.status(200).json(data.carDriver);
                });
        } else {
            res.status(404).json({
                "status": 404,
                "message": "Not Found: The Car&Driver Detail cannot be found"
            });
            return;
        }
    },

    /**
     * Update an existing Car&Driver Detail
     * @param req request having Car&Driver Detail ID
     * @param res response having only the resulting http status code
     */
    update: function(req, res) {
        // Check if id of Car&Driver detail passed with the request valid for MongoDB or not
        var isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

        if (isIdValid) {
            // Convert string typed id to ObjectId compatible with MongoDB
            var id = mongoose.Types.ObjectId(req.params.id);

            var carDriver = req.body.carDriver || '';

            User.update({'carDriver._id': id},
                {
                    $set: {
                        'carDriver.licenceNumber': carDriver.licenceNumber,
                        'carDriver.licenceImageUrl': carDriver.licenceImageUrl,
                        'carDriver.licenceImageMd5': carDriver.licenceImageMd5,
                        'carDriver.vehiclePlate': carDriver.vehiclePlate,
                        'carDriver.vehicleMake': carDriver.vehicleMake,
                        'carDriver.vin': carDriver.vin
                    }
                }, function (err) {

                    if (err) {
                        res.status(500).json({
                            "status": 500,
                            "message": "Internal error: The Car&Driver Detail cannot be updated"
                        });
                        return;
                    }

                    res.status(201).json({
                        "status": 201,
                        "message": "Created: The Car&Driver Detail is updated"
                    });
                });
        } else {
            res.status(404).json({
                "status": 404,
                "message": "Not Found: The Car&Driver Detail cannot be found"
            });
            return;
        }
    },
};

module.exports = routers;
