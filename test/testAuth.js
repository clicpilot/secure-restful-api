process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var bcrypt = require('bcrypt');
var server = require('../server');
var should = chai.should();
var config = require('../config');
var jwt = require('jwt-simple');

chai.use(chaiHttp);

var User = require('../app/models/user');
var BusinessInfo = require('../app/models/businessInfo');

/* describe() is used for grouping tests in a logical manner. */
describe('Test Auth', function() {

    var newuser;
    var newbusiness;
    var password = "12345.";



    before(function(done){
        User.collection.drop();
        BusinessInfo.collection.drop();
        done();
    });



    beforeEach(function(done){
        newuser = new User();
        newuser.username = "trial@gmail.com";
        newuser.role = "store";
        newuser.profile = {
            firstname: "Hasan",
            lastname: "Topcu",
            phone: "905051111111",
            email: "mymail@gmail.com",
            photoUrl: "/My/Photo/Url/On/Aws"
        };

        newbusiness = {
            storeName: "Hasan",
            bio: "Topcu",
            photoUrl: "/My/Photo/Url/On/Aws",
            phone: "905051111111",
            email: "mymail@gmail.com",
            address: "mymail@gmail.com",
            latitude: "mymail@gmail.com",
            longtitude: "mymail@gmail.com"
        };

        bcrypt.hash(password, 10, function (err, hash) {
            newuser.password = hash;


            done();
        });

    });

    afterEach(function(done){
        User.collection.drop();
        BusinessInfo.collection.drop();

        done();
    });


    it('should register a user /register', function(done) {

        // Again try to register the current user. should give conflict
        chai.request(server)
            .post('/register')
            .send({user: newuser, business: newbusiness, driver: {}})
            .end(function (err, res) {


                res.should.have.status(201);

                User.findOne({username: newuser.username})
                    .exec(function (err, user) {

                        newuser.username.should.equal(user.username);
                        newuser.role.should.equal(user.role);
                        newuser.profile.firstname.should.equal(user.profile.firstname);
                        newuser.profile.lastname.should.equal(user.profile.lastname);
                        newuser.profile.phone.should.equal(user.profile.phone);
                        newuser.profile.email.should.equal(user.profile.email);
                        newuser.profile.photoUrl.should.equal(user.profile.photoUrl);

                        done();

                    });

                BusinessInfo.findOne({_id: newuser.businessId})
                    .exec(function (err, business) {


                        newbusiness.storeName.should.equal(business.storeName);
                        newbusiness.bio.should.equal(business.bio);
                        newbusiness.photoUrl.should.equal(business.photoUrl);
                        newbusiness.phone.should.equal(business.phone);
                        newbusiness.email.should.equal(business.email);
                        newbusiness.address.should.equal(business.address);
                        newbusiness.latitude.should.equal(business.latitude);
                        newbusiness.longtitude.should.equal(business.longtitude);

                        done();

                    });




            });



    });


    it('should give an user already exist error /register', function(done) {

        // First create the user
        newuser.save(function (err, user) {

            // Again try to register the current user. should give conflict
            chai.request(server)
                .post('/register')
                .send({user: user})
                .end(function (err, res) {
                    // Conflict - User already exist
                    res.should.have.status(409);

                    done();
                });

        });


    });


    it('should give an user/password empty error /register', function(done) {

        var user = new User();
        user.username = '';
        user.password = '';
        user.role = '';


        chai.request(server)
            .post('/register')
            .send({user: user})
            .end(function(err, res){
                // Conflict - User already exist
                res.should.have.status(401);

                done();
            });
    });



    it('should give an user/password empty error /login', function(done) {

        chai.request(server)
            .post('/login')
            .send({username: '', password: ''})
            .end(function(err, res){
                // Conflict - User already exist
                res.should.have.status(401);

                done();
            });
    });



    it('should give an invalid cridentials error /login', function(done) {

        chai.request(server)
            .post('/login')
            .send({'username': 'nosuchuser@nosuchuser.com', 'password': 'nosuchuser'})
            .end(function(err, res){
                // Conflict - User already exist
                res.should.have.status(401);

                done();
            });
    });


    it('should send token on valid store login', function(done) {


        var businessInfo = new BusinessInfo();
        businessInfo.storeName = newbusiness.storeName;
        businessInfo.bio = newbusiness.bio;
        businessInfo.photoUrl = newbusiness.photoUrl;
        businessInfo.phone = newbusiness.phone;
        businessInfo.email = newbusiness.email;
        businessInfo.address = newbusiness.address;
        businessInfo.latitude = newbusiness.latitude;
        businessInfo.longtitude = newbusiness.longtitude;


        businessInfo.save(function(err,bsns) {

            newuser.businessId = bsns._id;

            // Save the user
            newuser.save(function(err,user) {

                chai.request(server)
                    .post('/login')
                    .send({username: newuser.username, password: password})
                    .end(function(err, res){


                        res.should.have.status(200);

                        res.body.should.be.a('object');
                        res.body.should.have.property('token');
                        res.body.should.have.property('expires');
                        res.body.should.have.property('username');

                        res.body.username.should.equal(user.username);



                        // Decode the token generated by jwt
                        var decoded = jwt.decode(res.body.token, config.secret);

                        console.log(decoded);

                        decoded.should.have.property('userId');
                        decoded.should.have.property('username');
                        decoded.should.have.property('exp');

                        decoded.userId.should.equal(user.id);
                        decoded.username.should.equal(user.username);


                        done();
                    });


            });



        });

    });





});
