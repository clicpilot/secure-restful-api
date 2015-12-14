process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var bcrypt = require('bcrypt');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

var User = require('../app/models/user');

/* describe() is used for grouping tests in a logical manner. */
describe('Test Auth', function() {


    this.timeout(10000);

    beforeEach(function(done){
        done();
    });
    afterEach(function(done){
        done();
    });

    // it() statements contain each individual test case, which generally (err, should) test a single feature
    it('should give an user already exist error /register', function(done) {

        chai.request(server)
            .post('/register')
            .send({'username': 'hasanht@gmail.com', 'password': '123456'})
            .end(function(err, res){
                // Conflict - User already exist
                res.should.have.status(409);

                done();
            });
    });

    // it() statements contain each individual test case, which generally (err, should) test a single feature
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


    // it() statements contain each individual test case, which generally (err, should) test a single feature
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


    // it() statements contain each individual test case, which generally (err, should) test a single feature
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


    // it() statements contain each individual test case, which generally (err, should) test a single feature
    it('should send token on valid login /login', function(done) {

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

                        done();
                    });
            });
        });




    });


});
