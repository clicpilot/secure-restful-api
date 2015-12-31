var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BookingSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Booking', BookingSchema);
