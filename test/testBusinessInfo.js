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
var Address = require('../app/models/address');

chai.use(chaiHttp);


/* describe() is used for grouping tests in a logical manner. */
describe('Test Business Info', function() {

    var mToken;
    var mUser;

    before(function(done){
        // After each test method, drop User collection
        Address.collection.drop();
        User.collection.drop();

        done();
    });

    beforeEach(function(done){
        var storeUser = new User();
        storeUser.username = "hhtopcu@gmail.com";
        storeUser.password = "123456";
        storeUser.role = "store";
        storeUser.profile = {
            firstname: "Hasan",
            lastname: "Topcu",
            phone: "905051111111",
            email: "mymail@gmail.com",
            photoUrl: "/My/Photo/Url/On/Aws",
            photoMd5: "1abcdefghijklm",
        };

        // business information
        storeUser.business = {
            storeName: "Kinetica",
            bio: "Creative Mobile Development Agency",
            photoUrl: "/My/Photo/Url/On/Aws",
            photoMd5: "3abcdefghijklm",
            phone: "905051111111",
            email: "mymail@gmail.com",
            address: {
                street: "Mustafa Kemal mh.",
                city: "Ankara",
                country: "TR",
                zip: "06510",
                location: {
                    type : "Point",
                    coordinates : [36.6362, 42.12145]
                }
            }
        };


        bcrypt.hash(storeUser.password, 10, function (err, hash) {
            storeUser.password = hash;

            // Save the user
            storeUser.save(function(err,user) {

                if(!err) {
                    var days = 7;
                    var dateObj = new Date();
                    var expires = dateObj.setDate(dateObj.getDate() + days);

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
                } else {
                    console.log(err);
                }
            });
        });
    });


    afterEach(function(done){
        // After each test method, drop User collection
        Address.collection.drop();
        User.collection.drop();

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
            .get('/v1/businessinfo/'+ mUser.business.id)
            .set('x-access-token', mToken)
            .end(function(err, res){

                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');

                res.body.should.have.property('_id');
                res.body.should.have.property('storeName');
                res.body.should.have.property('bio');
                res.body.should.have.property('photoUrl');
                res.body.should.have.property('photoMd5');
                res.body.should.have.property('phone');
                res.body.should.have.property('email');
                res.body.should.have.property('address');

                res.body.address.should.have.property('street');
                res.body.address.should.have.property('city');
                res.body.address.should.have.property('country');
                res.body.address.should.have.property('zip');
                res.body.address.should.have.property('location');
                res.body.address.should.have.property('createdDate');

                res.body._id.should.equal(mUser.business._id + "");
                res.body.storeName.should.equal(mUser.business.storeName);
                res.body.bio.should.equal(mUser.business.bio);
                res.body.photoUrl.should.equal(mUser.business.photoUrl);
                res.body.photoMd5.should.equal(mUser.business.photoMd5);
                res.body.phone.should.equal(mUser.business.phone);
                res.body.email.should.equal(mUser.business.email);

                done();
            });

    });

    it('should update a single business info /businessinfo/:id /PUT', function(done) {

        var updated = {
            storeName: "Kinetica",
            bio: "Mobile Development Agency",
            photoUrl: "/My/Photo/Url/On/Aws",
            photoMd5: "7abcdefghijklm",
            phone: "905051111111",
            email: "mymail@gmail.com",
            address: {
                street: "Mustafa Kemal mh.",
                city: "Ankara",
                country: "TR",
                zip: "06510",
                location: {
                    type : "Point",
                    coordinates : [36.6362, 42.12145]
                }
            }
        };

        // Send request
        chai.request(server)
            .put('/v1/businessinfo/'+ mUser.business.id)
            .set('x-access-token', mToken)
            .send({business: updated})
            .end(function(err, res){

                (err === null).should.be.true;
                res.should.have.status(201);

                // Find the business info about the user
                User.findOne({'business._id': mUser.business.id})
                    .select('business')
                    .exec(function (err, user) {

                        (err === null).should.be.true;

                        var business = user.business;

                        business.should.have.property('_id');
                        business.should.have.property('storeName');
                        business.should.have.property('bio');
                        business.should.have.property('photoUrl');
                        business.should.have.property('photoMd5');
                        business.should.have.property('phone');
                        business.should.have.property('email');
                        business.should.have.property('address');

                        business.address.should.have.property('street');
                        business.address.should.have.property('city');
                        business.address.should.have.property('country');
                        business.address.should.have.property('zip');
                        business.address.should.have.property('location');
                        business.address.should.have.property('createdDate');


                        mUser.business.id.should.equal(business._id + "");
                        business.storeName.should.equal(updated.storeName);
                        business.bio.should.equal(updated.bio);
                        business.photoUrl.should.equal(updated.photoUrl);
                        business.photoMd5.should.equal(updated.photoMd5);
                        business.phone.should.equal(updated.phone);
                        business.email.should.equal(updated.email);



                        done();
                    });
            });
    });
});
