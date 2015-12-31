/**
 * Created by hhtopcu on 31/12/15.
 */
var mongoose        = require('mongoose');
var User = require('../models/user');

var routers = {

    /* Get single instance of booking */
    getOne: function(req, res) {

        var valid = mongoose.Types.ObjectId.isValid(req.params.id);

        if (valid) {
            var id = mongoose.Types.ObjectId(req.params.id);

            User.findOne({'carDriver._id': id})
                .select('carDriver')
                .exec(function (err, data) {

                    if ((err || !data)) {
                        res.status(404).send();
                        return;
                    }

                    res.status(200).json(data.carDriver);
                });
        } else {
            res.status(404).send();
            return;
        }
    },


    /* Update an existing booking */
    update: function(req, res, next) {

        var valid = mongoose.Types.ObjectId.isValid(req.params.id);

        if (valid) {
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
                        console.log(err);
                        res.status(409).send();
                        return;
                    }

                    res.status(201).json({message: 'Car&Driver is updated!'});
                });
        } else {
            res.status(409).send();
            return;
        }
    },

};


module.exports = routers;
