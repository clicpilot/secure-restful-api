//var express = require('express');
//var router = express.Router();

var Booking     = require('../models/booking');

/*
router.route('/bookings')
    // get all the bookings (accessed at GET http://localhost:8080/api/bookings)
    .get(function(req, res) {
        Booking.find(function(err, bookings) {
            if (err)
                res.send(err);

            res.json(bookings);
        });
    })
    // create a booking (accessed at POST http://localhost:8080/api/bookings)
    .post(function(req, res) {
        
        var booking = new Booking();      // create a new instance of the Booking model
        booking.name = req.body.name;  // set the bookings name (comes from the request)

        // save the booking and check for errors
        booking.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Booking is created!' });
        });
        
    });


router.route('/booking/:booking_id')    
    // get the booking with that id (accessed at GET http://localhost:8080/api/bookings/:booking_id)
    .get(function(req, res) {
        Booking.findById(req.params.booking_id, function(err, booking) {
            if (err)
                res.send(err);

            res.json(booking);
        });
    })
    // update the booking with this id (accessed at PUT http://localhost:8080/api/bookings/:booking_id)
    .put(function(req, res) {

        // use our booking model to find the booking we want
        Booking.findById(req.params.booking_id, function(err, booking) {

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
    })
    // delete the booking with this id (accessed at DELETE http://localhost:8080/api/bookings/:booking_id)
    .delete(function(req, res) {
        Booking.remove({
            _id: req.params.booking_id
        }, function(err, booking) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
*/

var routers = {
 
  getAll: function(req, res) {
    Booking.find(function(err, bookings) {
            if (err)
                res.send(err);

            res.json(bookings);
        });
  },
 
  getOne: function(req, res) {
    var id = req.params.id;

    Booking.findById(id, function(err, booking) {
            if (err)
                res.send(err);

            res.json(booking);
        });
  },
 
  create: function(req, res) {

    var booking = new Booking();      // create a new instance of the Booking model
    booking.name = req.body.name;  // set the bookings name (comes from the request)

    // save the booking and check for errors
    booking.save(function(err) {
    if (err)
        res.send(err);
        res.json({ message: 'Booking is created!' });
    });

  },
 
  update: function(req, res) {

    var id = req.params.id;

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



  },
 
  delete: function(req, res) {
    var id = req.params.id;

    Booking.remove({
        _id: id
    }, function(err, booking) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });

  }
};


module.exports = routers;
