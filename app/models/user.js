var mongoose        = require('mongoose');

var UserSchema   = require('./Schemas/userSchema');

module.exports = mongoose.model('User', UserSchema);
