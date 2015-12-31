/**
 * Created by hhtopcu on 16/12/15.
 */
var mongoose        = require('mongoose');
var User = require('../models/user');

var routers = {

    /* Get single instance of booking */
    getOne: function(req, res) {

        var valid = mongoose.Types.ObjectId.isValid(req.params.id);

        if (valid) {
            var id = mongoose.Types.ObjectId(req.params.id);

            User.findOne({'business._id': id})
                .select('business')
                .exec(function (err, data) {

                    if (err || !data) {
                        res.status(404).send();
                        return;
                    }

                    res.status(200).json(data.business);

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

            var business = req.body.business || '';

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
                        console.log(err);
                        res.status(409).send();
                        return;
                    }

                    res.status(201).json({message: 'Business Info is updated!'});
                });
        } else {
            res.status(409).send();
            return;
        }
    },

};


module.exports = routers;
