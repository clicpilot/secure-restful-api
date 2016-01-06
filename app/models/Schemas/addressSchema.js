/**
 * Created by hhtopcu on 25/12/15.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AddressSchema = new Schema({
    street: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    zip: { type: String, required: false },

    // Geo Point Location
    location : {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number],// [Long, Lan]\
    },

    createdDate: { type: Date, required: true, default: Date.now }
});

AddressSchema.index({location: '2dsphere'});

module.exports = AddressSchema;
