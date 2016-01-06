var mongoose        = require('mongoose');
var BookingSchema   = require('./Schemas/bookingSchema');

module.exports = mongoose.model('Booking', BookingSchema);
