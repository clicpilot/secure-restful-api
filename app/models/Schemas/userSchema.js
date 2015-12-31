/**
 * Created by hhtopcu on 30/12/15.
 */
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var UserProfileSchema   = require('./userProfileSchema');
var CarDriverSchema   = require('./carDriverSchema');
var BusinessInfoSchema   = require('./businessInfoSchema');

var UserSchema   = new Schema({
    username: { type: String, required: true },                     // Username
    password: { type: String, required: true, select: false },      // Encrypted password
    role: { type: String, required: true },                         // role: admin, store, driver
    date: { type: Date, required: true, default: Date.now },        // Creation datetime
    isApproved: { type: Boolean, required: true , default: false},

    // Information about the user
    profile: UserProfileSchema,

    // The user's favorite addreses
    favoriteAddresses: [{type: Schema.Types.ObjectId, required: false, ref: "Address"}],


    // Car & Driver Details -> role == driver
    carDriver: CarDriverSchema,

    // Business Info -> role = store
    // Now: It's one-to-one but it will be asked. What is the requirements?
    business: BusinessInfoSchema,

});

module.exports = UserSchema;