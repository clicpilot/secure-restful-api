var express = require('express');
var router = express.Router();
 
var auth = require('./auth.js');
var bookings = require('./bookings.js');
var businessinfo = require('./businessinfo.js');

 
/*
 * Routes that can be accessed by any one
 */
router.post('/v1/login', auth.login);
router.post('/v1/register', auth.register);
 
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

 
/*
 * Routes that can be accessed only by authenticated & authorized users
 */

/*
router.get('/api/v1/admin/users', user.getAll);
router.get('/api/v1/admin/user/:id', user.getOne);
router.post('/api/v1/admin/user/', user.create);
router.put('/api/v1/admin/user/:id', user.update);
router.delete('/api/v1/admin/user/:id', user.delete);
*/
 
module.exports = router;