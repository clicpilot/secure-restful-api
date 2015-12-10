process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);


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




});
