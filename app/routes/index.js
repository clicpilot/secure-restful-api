var express         = require('express');
var auth            = require('./auth.js');
var bookings        = require('./bookings.js');
var businessinfo    = require('./businessinfo.js');
var cardriver       = require('./cardriver.js');

var router          = express.Router();

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);
router.post('/register', auth.register);
router.post('/forgot', auth.forgot);
 
/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/v1/bookings', bookings.getAll);
router.post('/v1/bookings/', bookings.create);
router.get('/v1/booking/:id', bookings.getOne);
router.put('/v1/booking/:id', bookings.update);
router.delete('/v1/booking/:id', bookings.delete);
router.get('/v1/businessinfo/:id', businessinfo.getOne);
router.put('/v1/businessinfo/:id', businessinfo.update);
router.get('/v1/cardriver/:id', cardriver.getOne);
router.put('/v1/cardriver/:id', cardriver.update);
 
/*
 * Routes that can be accessed only by authenticated & authorized users
 */
// TODO: Admin routes
 
module.exports = router;