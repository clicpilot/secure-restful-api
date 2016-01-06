/**
 * Created by hhtopcu on 30/12/15.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BookingSchema = new Schema({
    name: String
});

module.exports = BookingSchema;
