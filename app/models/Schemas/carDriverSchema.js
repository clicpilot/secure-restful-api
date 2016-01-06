/**
 * Created by hhtopcu on 30/12/15.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CarDriverSchema = new Schema({
    licenceNumber: { type: String, required: false },               // Official name of the Store
    licenceImageUrl: { type: String, required: false },             // Amazon S3 relative url
    licenceImageMd5: { type: String, required: false },             // Image MD5
    vehiclePlate: { type: String, required: false },                // Store's plate number
    vehicleMake: { type: String, required: false },                 //
    vin: { type: String, required: false }                          //
});

module.exports = CarDriverSchema;
