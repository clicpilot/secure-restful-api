var express = require('express');
var router = express.Router();

var Booking     = require('../models/booking');


router.route('/bookings')
    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Booking.find(function(err, bookings) {
            if (err)
                res.send(err);

            res.json(bookings);
        });
    })
    // create a booking (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        
        var booking = new Booking();      // create a new instance of the Bear model
        booking.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        booking.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Booking is created!' });
        });
        
    });


router.route('/bookings/:booking_id')    
    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Booking.findById(req.params.booking_id, function(err, booking) {
            if (err)
                res.send(err);

            res.json(booking);
        });
    })
    // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function(req, res) {

        // use our booking model to find the bear we want
        Booking.findById(req.params.booking_id, function(err, booking) {

            if (err)
                res.send(err);

            booking.name = req.body.name;  // update the bears info

            // save the bear
            booking.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Booking updated!' });
            });

        });
    })
    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Booking.remove({
            _id: req.params.booking_id
        }, function(err, booking) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


module.exports = router;
