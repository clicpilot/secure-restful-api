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


    this.timeout(10000);

    User.collection.drop();

    beforeEach(function(done){
        done();
    });
    afterEach(function(done){
        User.collection.drop();
        done();
    });


    it('should register a user /register', function(done) {

        var newuser = new User();
        var password = "12345.";
        newuser.username = "trial@gmail.com";
        newuser.role = "admin";
        newuser.profile = {
            firstname: "Hasan",
            lastname: "Topcu",
            phone: "905051111111",
            email: "mymail@gmail.com",
            photoUrl: "/My/Photo/Url/On/Aws"
        };

        newuser.store = {
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

            // Again try to register the current user. should give conflict
            chai.request(server)
                .post('/register')
                .send(newuser)
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

                            newuser.store.storeName.should.equal(user.store.storeName);
                            newuser.store.bio.should.equal(user.store.bio);
                            newuser.store.photoUrl.should.equal(user.store.photoUrl);
                            newuser.store.phone.should.equal(user.store.phone);
                            newuser.store.email.should.equal(user.store.email);
                            newuser.store.address.should.equal(user.store.address);
                            newuser.store.latitude.should.equal(user.store.latitude);
                            newuser.store.longtitude.should.equal(user.store.longtitude);

                            done();

                        });

                });

        });

    });


    it('should give an user already exist error /register', function(done) {

        var user = new User();
        var password = "12345.";
        user.username = "trial@gmail.com";
        user.role = "admin";


        bcrypt.hash(password, 10, function (err, hash) {
            user.password = hash;

            // First create the user
            user.save(function (err, user) {

                // Again try to register the current user. should give conflict
                chai.request(server)
                    .post('/register')
                    .send({'username': user.username, 'password': password})
                    .end(function (err, res) {
                        // Conflict - User already exist
                        res.should.have.status(409);

                        done();
                    });

            });
        });

    });


    it('should give an user/password empty error /register', function(done) {

        chai.request(server)
            .post('/register')
            .send({'username': '', 'password': ''})
            .end(function(err, res){
                // Conflict - User already exist
                res.should.have.status(401);

                done();
            });
    });



    it('should give an user/password empty error /login', function(done) {

        chai.request(server)
            .post('/login')
            .send({'username': '', 'password': ''})
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


    it('should send token on valid login', function(done) {

        var user = new User();
        var password = "12345.";
        user.username = "trial@gmail.com";
        user.role = "admin";


        bcrypt.hash(password, 10, function (err, hash) {
            user.password = hash;
            user.save(function(err,user) {

                if(err) { return(next(err)); }


                chai.request(server)
                    .post('/login')
                    .send({'username': user.username, 'password': password})
                    .end(function(err, res){
                        // Conflict - User already exist
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




    });


});
