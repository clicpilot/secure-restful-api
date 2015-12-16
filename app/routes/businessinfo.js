/**
 * Created by hhtopcu on 16/12/15.
 */
var etag = require('etag')

var BusinessInfo     = require('../models/businessInfo');

var routers = {

    /* Get single instance of booking */
    getOne: function(req, res) {

        var id = req.params.id;

        BusinessInfo.findById(id, function (err, business) {
            if (err) {
                res.status(404).send();
                return;
            }

            res.status(200).json(business);
        });
    },


    /* Update an existing booking */
    update: function(req, res) {

        var id = req.params.id;


        BusinessInfo.update({ _id: id },
            { $set: {
                name: req.body.name
            }}, function(err){

                if (err) next();

                res.status(201).json({ message: 'Booking updated!' });
            });


    },

};


module.exports = routers;
