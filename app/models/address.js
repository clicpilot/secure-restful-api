/**
 * Created by hhtopcu on 30/12/15.
 */
var mongoose        = require('mongoose');

var AddressSchema   = require('./Schemas/addressSchema');

module.exports = mongoose.model('Address', AddressSchema);
