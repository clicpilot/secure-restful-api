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

/* describe() is used for grouping tests in a logical manner. */
describe('Test Auth', function() {

    var newuser;
    var password = "12345.";

    before(function(done){
        User.collection.drop();
        done();
    });

    beforeEach(function(done){
        // Create Model
        newuser = new User();
        newuser.username = "hhtopcu@gmail.com";
        newuser.role = "store";
        newuser.profile = {
            firstname: "Hasan",
            lastname: "Topcu",
            phone: "905051111111",
            email: "mymail@gmail.com",
            photoUrl: "/My/Photo/Url/On/Aws"
        };

        // business information
        newuser.business = {
            storeName: "Hasan",
            bio: "Topcu",
            photoUrl: "/My/Photo/Url/On/Aws",
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

        // Hash the password
        bcrypt.hash(password, 10, function (err, hash) {
            newuser.password = hash;

            done();
        });

    });

    afterEach(function(done){
        // After each test method, drop User collection
        User.collection.drop();

        done();
    });


    it('should register a user /register', function(done) {

        chai.request(server)
            .post('/register')
            .send({user: newuser})
            .end(function (err, res) {

                // should register successfully
                res.should.have.status(201);

                User.findOne({username: newuser.username})
                    .exec(function (err, user) {

                        (err === null).should.be.true;

                        //console.log(user)

                        user.username.should.equal(newuser.username);
                        user.role.should.equal(newuser.role);
                        user.profile.firstname.should.equal(newuser.profile.firstname);
                        user.profile.lastname.should.equal(newuser.profile.lastname);
                        user.profile.phone.should.equal(newuser.profile.phone);
                        user.profile.email.should.equal(newuser.profile.email);
                        user.profile.photoUrl.should.equal(newuser.profile.photoUrl);

                        user.business.storeName.should.equal(newuser.business.storeName);
                        user.business.bio.should.equal(newuser.business.bio);
                        user.business.photoUrl.should.equal(user.business.photoUrl);
                        user.business.phone.should.equal(newuser.business.phone);
                        user.business.email.should.equal(newuser.business.email);


                        user.business.should.have.property('address');
                        user.business.address.should.have.property('street');
                        user.business.address.should.have.property('city');
                        user.business.address.should.have.property('country');
                        user.business.address.should.have.property('zip');
                        user.business.address.should.have.property('location');
                        user.business.address.should.have.property('createdDate');

                        user.business.address.street.should.equal(newuser.business.address.street);
                        user.business.address.city.should.equal(newuser.business.address.city);
                        user.business.address.country.should.equal(newuser.business.address.country);
                        user.business.address.zip.should.equal(newuser.business.address.zip);

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
                // Invalid cridentials
                res.should.have.status(401);

                done();
            });
    });



    it('should give an user/password empty error /login', function(done) {

        chai.request(server)
            .post('/login')
            .send({username: '', password: ''})
            .end(function(err, res){
                // Invalid cridentials
                res.should.have.status(401);

                done();
            });
    });



    it('should give an invalid cridentials error /login', function(done) {

        chai.request(server)
            .post('/login')
            .send({'username': 'nosuchuser@nosuchuser.com', 'password': 'nosuchuser'})
            .end(function(err, res){
                // Invalid cridentials
                res.should.have.status(401);

                done();
            });
    });


    it('should send token on valid store login', function(done) {

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

                    decoded.should.have.property('userId');
                    decoded.should.have.property('username');
                    decoded.should.have.property('exp');

                    decoded.userId.should.equal(user.id);
                    decoded.username.should.equal(user.username);


                    done();
                });


        });


    });



    it('should send an email on /forgot', function(done) {

        // First create the user
        newuser.save(function (err, user) {

            chai.request(server)
                .post('/forgot')
                .send({username: 'hhtopcu@gmail.com'})
                .end(function (err, res) {
                    // Mail has been sent successfuly
                    res.should.have.status(200);

                    done();
                });
        });
    });

    it('should send an error on /forgot', function(done) {

        chai.request(server)
            .post('/forgot')
            .send({username: ''})
            .end(function(err, res){
                // Invalid credentials
                res.should.have.status(401);

                done();
            });
    });

    it('should send an error on /forgot', function(done) {

        chai.request(server)
            .post('/forgot')
            .send({username: 'nonosuchuser@gmail.com'})
            .end(function(err, res){
                // Invalid credentials
                res.should.have.status(401);

                done();
            });
    });

});
