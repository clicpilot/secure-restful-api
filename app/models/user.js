var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    username: { type: String, required: true },
  	password: { type: String, required: true, select: false },
  	role: { type: String, required: true }, // role: admin, store, driver
  	date: { type: Date, required: true, default: Date.now } // Creation datetime
});

module.exports = mongoose.model('User', UserSchema);