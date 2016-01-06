var etag        = require('etag')
var Booking     = require('../models/booking');

/**
 *
 * @type {{getAll: routers.getAll, getOne: routers.getOne, create: routers.create, update: routers.update, delete: routers.delete}}
 */
var routers = {

    /* Get all bookings */
    getAll: function(req, res) {
        Booking.find(function(err, bookings) {
            if (err && !bookings) {
                res.status(500).json({
                    "status": 500,
                    "message": "Internal Error: Booking(s) cannot be found"
                });
                return;
            }

            res.status(200).json(bookings);
        });
    },

    /* Get single instance of booking */
    getOne: function(req, res) {
        var id = req.params.id;

        Booking.findById(id, function (err, booking) {
            if (err && !booking) {
                res.status(500).json({
                    "status": 500,
                    "message": "Internal Error: Booking cannot be found"
                });
                return;
            }

            var etagHeader = req.headers['If-None-Match'] || req.headers['if-none-match'];

            /* we need a determinic order of properties  */
            //var computedEtag = etag(JSON.stringify(booking));

            var computedEtag = etag(booking._id + ";" + booking.name);

            if (etagHeader) {
                if (etagHeader == computedEtag) {
                    // if ETag of the resource matches with that ETag, res.status(304).send() // Not modified
                    res.status(304).send();
                    return;
                }
            }

            res.header('ETag', computedEtag);
            res.status(200).json(booking);
        });
    },

    /* Create a booking */
    create: function(req, res) {
        var booking = new Booking();      // create a new instance of the Booking model
        booking.name = req.body.name;  // set the bookings name (comes from the request)
        // save the booking and check for errors

        booking.save(function(err) {
            if (err) {
                res.status(500).json({
                    "status": 500,
                    "message": "Internal Error: Booking cannot be saved"
                });
                return;
            }
            res.status(201).json({ message: 'Booking is created!' });
        });
    },

    /* Update an existing booking */
    update: function(req, res) {
        var id = req.params.id;

        Booking.update({ _id: id }, { $set: { name: req.body.name }}, function(err){
            if (err) {
                res.status(500).json({
                    "status": 500,
                    "message": "Internal Error: Booking cannot be updated"
                });
                return;
            }

            res.status(201).json({ message: 'Booking updated!' });
        });
    },

    /* Delete the given booking */
    delete: function(req, res) {
        var id = req.params.id;

        Booking.remove({
            _id: id
        }, function(err, booking) {
            if (err && !booking) {
                res.status(500).json({
                    "status": 500,
                    "message": "Internal Error: Booking cannot be deleted"
                });
                return;
            }

            res.status(204).json({ message: 'Successfully deleted' });
        });
    }
};

module.exports = routers;
