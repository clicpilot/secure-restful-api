/**
 * Created by hhtopcu on 30/12/15.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AddressSchema   = require('./addressSchema');

var BusinessInfoSchema   = new Schema({

    storeName: { type: String, required: false },               // Official name of the Store
    bio: { type: String, required: false },                     // Store's bio
    photoUrl: { type: String, required: false },                // Amazon S3 relative url
    photoMd5: { type: String, required: false },                // Amazon S3 relative url
    phone: { type: String, required: false },                   // Store's official phone
    email: { type: String, required: false },                   // Store's official email
    address: AddressSchema
});

module.exports = BusinessInfoSchema