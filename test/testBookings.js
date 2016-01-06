process.env.NODE_ENV = 'test';

var chai        = require('chai');
var chaiHttp    = require('chai-http');
var server      = require('../server');
var jwt         = require('jwt-simple');
var config      = require('../config');
var etag        = require('etag')
var Booking     = require('../app/models/booking');
var User        = require('../app/models/user');
var Address     = require('../app/models/address');
var should      = chai.should();

chai.use(chaiHttp);

/**
 * Tests for bookings(requesting a driver)
 */
// TODO: This tests will be updated after changing Booking logic
describe('Test Bookings', function() {
    /* This token will be used in all test cases*/
    var token;

    before(function(done) {
        Booking.collection.drop();

        var user = new User();
        var password = "12345.";
        user.username = "trial@gmail.com";
        user.role = "admin";
        user.password = "A1234.";

        user.save(function(err,user) {
            if(err) {
                return(next(err));
            }

            var days = config.dayForTokenExpiration;
            var dateObj = new Date();
            var expires= dateObj.setDate(dateObj.getDate() + days);

            // Put username into encoded string, not password
            token = jwt.encode({
                exp: expires,
                username: user.username,
                userId: user._id,
                role: user.role
            }, config.secret);

            done();
        });
    });

    after(function(done) {
        Booking.collection.drop();
        Address.collection.drop();
        User.collection.drop();

        done();
    });

    beforeEach(function(done) {
        done();
    });

    afterEach(function(done) {
        Booking.collection.drop();

        done();
    });

    // it() statements contain each individual test case, which generally (err, should) test a single feature
    it('should give an authorization error /v1/bookings GET', function(done) {
        chai.request(server)
            .get('/v1/bookings')
            .set('x-access-token', '')
            .end(function(err, res){
                res.should.have.status(400);
                done();
            });
    });

    // it() statements contain each individual test case, which generally (err, should) test a single feature
    it('should give an authorization error /v1/bookings GET', function(done) {
        chai.request(server)
            .get('/v1/bookings')
            .set('x-access-token', 'Non empty but wrong access token')
            .end(function(err, res) {
                res.should.have.status(403);
                done();
            });
    });

    // it() statements contain each individual test case, which generally (err, should) test a single feature
    it('should list ALL bookings on /v1/bookings GET', function(done) {
        chai.request(server)
            .get('/v1/bookings')
            .set('x-access-token', token)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                done();
            });
    });


    it('should add a SINGLE booking on /bookings POST', function(done){
        chai.request(server)
            .post('/v1/bookings')
            .send({name: "This is a test booking"})
            .set('x-access-token', token)
            .end(function(err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                done();
            });
    });

    it('should get a SINGLE booking on /booking/:id GET', function(done){
        var newBooking = new Booking({
            name: 'New booking'
        });

        newBooking.save(function(err, data) {
            chai.request(server)
                .get('/v1/booking/'+ data.id)
                .set('x-access-token', token)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.name.should.equal(newBooking.name);
                    res.body._id.should.equal(data.id);
                    done();
                });
        });
    });

    it('should update a SINGLE booking on /booking/:id PUT', function(done){
        var newBooking = new Booking({
            name: 'New booking'
        });

        newBooking.save(function(err, data) {
            chai.request(server)
                .put('/v1/booking/'+ data.id)
                .send({name : "Updated Booking"})
                .set('x-access-token', token)
                .end(function(err, res) {
                    res.should.have.status(201);
                    done();
                });
        });
    });

    it('should delete a SINGLE booking on /booking/:id DELETE', function(done){
        var newBooking = new Booking({
            name: 'New booking'
        });

        newBooking.save(function(err, data) {
            chai.request(server)
                .delete('/v1/booking/'+ data.id)
                .set('x-access-token', token)
                .end(function(err, res) {
                    res.should.have.status(204);
                    done();
                });
        });

    });

    /* Wrong etag */
    it('should get a non-cached booking on /booking/:id GET', function(done){
        var newBooking = new Booking({
            name: 'New booking'
        });

        newBooking.save(function(err, data) {
            chai.request(server)
                .get('/v1/booking/'+ data.id)
                .set('x-access-token', token)
                .set('if-none-match', 'etag-no-match')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.name.should.equal(newBooking.name);
                    res.body._id.should.equal(data.id);
                    done();
                });
        });
    });

    /* Correct etag */
    it('should get a 304 Not modified on /booking/:id GET', function(done){
        var newBooking = new Booking({
            name: 'New booking'
        });

        newBooking.save(function(err, data) {
            (err === null).should.be.true;
            (data != null).should.be.true;

            var tag = etag(data._id + ";" + data.name);
            chai.request(server)
                .get('/v1/booking/'+ data.id)
                .set('x-access-token', token)
                .set('if-none-match', tag)
                .end(function(err, res) {
                    res.should.have.status(304);

                    done();
                });
        });
    });
});
