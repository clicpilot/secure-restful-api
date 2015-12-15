var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var UserSchema   = new Schema({
    username: { type: String, required: true },                 // Username
  	password: { type: String, required: true, select: false },  // Encrypted password
  	role: { type: String, required: true },                     // role: admin, store, driver
  	date: { type: Date, required: true, default: Date.now },    // Creation datetime

    // UserProfile
    profile: {
        firstname: { type: String, required: false },                // User firstname
        lastname: { type: String, required: false },                 // User lastname
        phone: { type: String, required: false },                   // User personal phone
        email: { type: String, required: false },                   // User personal email
        photoUrl: { type: String, required: false },                // Amazon S3 relative url
    },

    // Business Info
    store: {
        storeName: { type: String, required: false },                // Official name of the Store
        bio: { type: String, required: false },                     // Store's bio
        photoUrl: { type: String, required: false },                // Amazon S3 relative url
        phone: { type: String, required: false },                   // Store's official phone
        email: { type: String, required: false },                   // Store's official email
        address: { type: String, required: false },                 // Store address
        latitude: { type: String, required: false },                // Address latitude
        longtitude: { type: String, required: false },              // Address longtitude
    }
});

module.exports = mongoose.model('User', UserSchema);