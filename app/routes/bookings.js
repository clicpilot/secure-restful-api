var express = require('express');
var router = express.Router();

var Booking     = require('../models/booking');

/* GET users listing. 
router.get('/bookings', function(req, res, next) {
  res.json({ message: 'Booking created!' });
});
*/

router.route('/bookings')


	// get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Booking.find(function(err, bookings) {
            if (err)
                res.send(err);

            res.json(bookings);
        });
    })

    // create a bear (accessed at POST http://localhost:8080/api/bears)
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

module.exports = router;
