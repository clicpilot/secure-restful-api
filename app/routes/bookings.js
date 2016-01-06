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
            if (err)
                res.send(err);

            res.json(bookings);
        });
    },

    /* Get single instance of booking */
    getOne: function(req, res) {

        var id = req.params.id;
        Booking.findById(id, function (err, booking) {
            if (err) {
                res.send(err);
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
            res.json(booking);
        });


    },

    /* Create a booking */
    create: function(req, res) {


        var booking = new Booking();      // create a new instance of the Booking model
        booking.name = req.body.name;  // set the bookings name (comes from the request)
        // save the booking and check for errors

        booking.save(function(err) {
            if (err){
                res.send(err);
            }
            res.status(201).json({ message: 'Booking is created!' });
        });

    },

    /* Update an existing booking */
    update: function(req, res) {

        var id = req.params.id;

        /*
         // use our booking model to find the booking we want
         Booking.findById(id, function(err, booking) {

         if (err)
         res.send(err);

         booking.name = req.body.name;  // update the bookings info

         // save the booking
         booking.save(function(err) {
         if (err)
         res.send(err);

         res.json({ message: 'Booking updated!' });
         });

         });
         */

        Booking.update({ _id: id }, { $set: { name: req.body.name }}, function(err){
            if (err){res.send(err);}

            res.status(201).json({ message: 'Booking updated!' });
        });


    },

    /* Delete the given booking */
    delete: function(req, res) {
        var id = req.params.id;

        Booking.remove({
            _id: id
        }, function(err, booking) {
            if (err)
                res.send(err);

            res.status(204).json({ message: 'Successfully deleted' });
        });

    }
};


module.exports = routers;
