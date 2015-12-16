/**
 * Created by hhtopcu on 16/12/15.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var BusinessInfoSchema   = new Schema({

    storeName: { type: String, required: false },                // Official name of the Store
    bio: { type: String, required: false },                     // Store's bio
    photoUrl: { type: String, required: false },                // Amazon S3 relative url
    phone: { type: String, required: false },                   // Store's official phone
    email: { type: String, required: false },                   // Store's official email
    address: { type: String, required: false },                 // Store address
    latitude: { type: String, required: false },                // Address latitude
    longtitude: { type: String, required: false },              // Address longtitude

});

module.exports = mongoose.model('BusinessInfo', BusinessInfoSchema);