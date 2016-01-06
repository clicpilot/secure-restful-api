/**
 * Created by hhtopcu on 31/12/15.
 */
process.env.NODE_ENV = 'test';

var chai        = require('chai');
var chaiHttp    = require('chai-http');
var server      = require('../server');
var jwt         = require('jwt-simple');
var bcrypt      = require('bcrypt');
var config      = require('../config');
var User        = require('../app/models/user');
var Address     = require('../app/models/address');
var should      = chai.should();

chai.use(chaiHttp);

/* describe() is used for grouping tests in a logical manner. */
describe('Test Car&Driver Info', function() {

    var mToken;
    var mUser;

    before(function(done) {
        // After each test method, drop User collection
        Address.collection.drop();
        User.collection.drop();

        done();
    });

    beforeEach(function(done) {
        var driverUser = new User();
        driverUser.username = "atopcu@gmail.com";
        driverUser.password = "atopcu";
        driverUser.role = "driver";
        driverUser.profile = {
            firstname: "Ali",
            lastname: "Topcu",
            phone: "905051111111",
            email: "mymail@gmail.com",
            photoUrl: "/My/Photo/Url/On/Aws",
            photoMd5: "2abcdefghijklm",
        };

        driverUser.carDriver = {
            licenceNumber: "A12345678",
            licenceImageUrl: "/My/Photo/Url/On/Aws",
            licenceImageMd5: "4abcdefghijklm",
            vehiclePlate: "06 DM 4532",
            vehicleMake: "OPEL",
            vin: "Wu789amm8920amsa-12392"
        };

        bcrypt.hash(driverUser.password, 10, function (err, hash) {
            driverUser.password = hash;

            // Save the user
            driverUser.save(function(err,user) {
                if(!err) {
                    var days = config.dayForTokenExpiration;
                    var dateObj = new Date();
                    var expires = dateObj.setDate(dateObj.getDate() + days);

                    // Put username into encoded string, not password
                    mToken = jwt.encode({
                        //iss: user.id - //issuer
                        exp: expires,
                        username: user.username,
                        userId: user._id
                    }, config.secret);

                    mUser = user;

                    done();
                } else {
                    console.log(err);
                }
            });
        });
    });

    afterEach(function(done) {
        // After each test method, drop User collection
        Address.collection.drop();
        User.collection.drop();

        done();
    });

    it('should get a not found error for car&driver detail', function(done) {
        chai.request(server)
            .get('/v1/cardriver/'+ '4eb6e7e7e9b7f4194e000001')
            .set('x-access-token', mToken)
            .end(function(err, res){

                (err === null).should.be.true;
                res.should.have.status(500);
                done();
            });
    });

    it('should get a single car&detail', function(done) {
        chai.request(server)
            .get('/v1/cardriver/'+ mUser.carDriver.id)
            .set('x-access-token', mToken)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('licenceNumber');
                res.body.should.have.property('licenceImageUrl');
                res.body.should.have.property('licenceImageMd5');
                res.body.should.have.property('vehiclePlate');
                res.body.should.have.property('vehicleMake');
                res.body.should.have.property('vin');

                done();
            });
    });

    it('should update a single business info /businessinfo/:id /PUT', function(done) {
        var updated = {
            licenceNumber: "B87654321",
            licenceImageUrl: "/My/Photo/Url/On/Aws",
            licenceImageMd5: "383abcdefghijklm",
            vehiclePlate: "36 ABC 111",
            vehicleMake: "NISSAN",
            vin: "Wu789amm8920amsa-12399"
        };

        // Send request
        chai.request(server)
            .put('/v1/cardriver/'+ mUser.carDriver.id)
            .set('x-access-token', mToken)
            .send({carDriver: updated})
            .end(function(err, res) {

                (err === null).should.be.true;
                res.should.have.status(201);

                // Find the business info about the user
                User.findOne({'carDriver._id': mUser.carDriver.id})
                    .select('carDriver')
                    .exec(function (err, user) {

                        (err === null).should.be.true;

                        var carDriver = user.carDriver;

                        carDriver.should.have.property('_id');
                        carDriver.should.have.property('licenceNumber');
                        carDriver.should.have.property('licenceImageUrl');
                        carDriver.should.have.property('licenceImageMd5');
                        carDriver.should.have.property('vehiclePlate');
                        carDriver.should.have.property('vehicleMake');
                        carDriver.should.have.property('vin');
                        mUser.carDriver.id.should.equal(carDriver._id + "");
                        carDriver.licenceNumber.should.equal(updated.licenceNumber);
                        carDriver.licenceImageUrl.should.equal(updated.licenceImageUrl);
                        carDriver.licenceImageMd5.should.equal(updated.licenceImageMd5);
                        carDriver.vehiclePlate.should.equal(updated.vehiclePlate);
                        carDriver.vehicleMake.should.equal(updated.vehicleMake);
                        carDriver.vin.should.equal(updated.vin);

                        done();
                    });
            });
    });
});
