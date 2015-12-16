/**
 * Created by hhtopcu on 16/12/15.
 */
process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var config = require('../config');

var User = require('../app/models/user');
var BusinessInfo = require('../app/models/businessInfo');

chai.use(chaiHttp);


/* describe() is used for grouping tests in a logical manner. */
describe('Test Business Info', function() {

    var mToken;
    var mUser;
    var mBusinessInfo;



    before(function(done){
        var newuser = new User();
        newuser.username = "trial@gmail.com";
        newuser.role = "store";
        newuser.password = "12345.";

        newuser.profile = {
            firstname: "Hasan",
            lastname: "Topcu",
            phone: "905051111111",
            email: "mymail@gmail.com",
            photoUrl: "/My/Photo/Url/On/Aws"
        };

        mBusinessInfo = {
            storeName: "Hasan",
            bio: "Topcu",
            photoUrl: "/My/Photo/Url/On/Aws",
            phone: "905051111111",
            email: "mymail@gmail.com",
            address: "Los Angeles, CA",
            latitude: "40.12345",
            longtitude: "45.243242"
        };

        bcrypt.hash(newuser.password, 10, function (err, hash) {
            newuser.password = hash;


            var businessInfo = new BusinessInfo();
            businessInfo.storeName = mBusinessInfo.storeName;
            businessInfo.bio = mBusinessInfo.bio;
            businessInfo.photoUrl = mBusinessInfo.photoUrl;
            businessInfo.phone = mBusinessInfo.phone;
            businessInfo.email = mBusinessInfo.email;
            businessInfo.address = mBusinessInfo.address;
            businessInfo.latitude = mBusinessInfo.latitude;
            businessInfo.longtitude = mBusinessInfo.longtitude;


            businessInfo.save(function(err,bsns) {

                newuser.businessId = bsns._id;

                // Save the user
                newuser.save(function(err,user) {

                    var days = 7;
                    var dateObj = new Date();
                    var expires= dateObj.setDate(dateObj.getDate() + days);

                    // Put username into encoded string, not password
                    mToken = jwt.encode({
                        //iss: user.id - //issuer
                        exp: expires,
                        username: user.username,
                        userId: user._id,
                        businessId: user.businessId
                    }, config.secret);

                    mUser = user;


                    done();

                });
            });

        });

    });

    beforeEach(function(done){
        done();
    });

    afterEach(function(done){
        done();
    });


    it('should get a not found error for business info /businessinfo/:id /GET', function(done) {

        chai.request(server)
            .get('/v1/businessinfo/'+ 'a12345')
            .set('x-access-token', mToken)
            .end(function(err, res){

                (err === null).should.be.true;
                res.should.have.status(404);
                done();
            });

    });

    it('should get a single business info /businessinfo/:id /GET', function(done) {

        chai.request(server)
            .get('/v1/businessinfo/'+ mUser.businessId)
            .set('x-access-token', mToken)
            .end(function(err, res){

                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');


                res.body.should.have.property('_id');
                res.body.should.have.property('storeName');
                res.body.should.have.property('bio');
                res.body.should.have.property('photoUrl');
                res.body.should.have.property('phone');
                res.body.should.have.property('email');
                res.body.should.have.property('address');
                res.body.should.have.property('latitude');
                res.body.should.have.property('longtitude');


                res.body._id.should.equal(mUser.businessId + "");
                res.body.storeName.should.equal(mBusinessInfo.storeName);
                res.body.bio.should.equal(mBusinessInfo.bio);
                res.body.photoUrl.should.equal(mBusinessInfo.photoUrl);
                res.body.phone.should.equal(mBusinessInfo.phone);
                res.body.email.should.equal(mBusinessInfo.email);
                res.body.address.should.equal(mBusinessInfo.address);
                res.body.latitude.should.equal(mBusinessInfo.latitude);
                res.body.longtitude.should.equal(mBusinessInfo.longtitude);


                done();
            });

    });

    it('should update a single business info /businessinfo/:id /PUT', function(done) {

        chai.request(server)
            .put('/v1/businessinfo/'+ mUser.businessId)
            .set('x-access-token', mToken)
            .end(function(err, res){

                res.should.have.status(201);

                done();
            });

    });



});
