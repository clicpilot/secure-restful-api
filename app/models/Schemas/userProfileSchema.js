/**
 * Created by hhtopcu on 30/12/15.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var UserProfileSchema   = new Schema({
    firstname: { type: String, required: false },               // User firstname
    lastname: { type: String, required: false },                // User lastname
    phone: { type: String, required: false },                   // User personal phone
    email: { type: String, required: false },                   // User personal email
    photoUrl: { type: String, required: false },                // Amazon S3 relative url
});

module.exports = UserProfileSchema;