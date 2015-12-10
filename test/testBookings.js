process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

var Booking = require('../app/models/booking');


chai.use(chaiHttp);


/* describe() is used for grouping tests in a logical manner. */
describe('Test Bookings', function() {

    this.timeout(30000);

    Booking.collection.drop();

    beforeEach(function(done){
        done();
    });
    afterEach(function(done){
        Booking.collection.drop();
        done();
    });


    // it() statements contain each individual test case, which generally (err, should) test a single feature
    it('should give an authorization error /v1/bookings GET', function(done) {

        chai.request(server)
            .get('/v1/bookings')
            .set('x-access-token', '')
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });

    // it() statements contain each individual test case, which generally (err, should) test a single feature
    it('should give an authorization error /v1/bookings GET', function(done) {

        chai.request(server)
            .get('/v1/bookings')
            .set('x-access-token', 'Non empty but wrong access token')
            .end(function(err, res){
                res.should.have.status(403);
                done();
            });
    });

    // it() statements contain each individual test case, which generally (err, should) test a single feature
    it('should list ALL bookings on /v1/bookings GET', function(done) {

        chai.request(server)
            .get('/v1/bookings')
            .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NTAyNTM3MDg3ODYsInVzZXJuYW1lIjoiaGFzYW5odEBnbWFpbC5jb20ifQ.ae_Jpo26oEvBMz-H0qyNeBmFxzbgXM0QbmfLZKJm_JQ')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                done();
            });
    });


    it('should add a SINGLE booking on /bookings POST', function(done){
        chai.request(server)
            .post('/v1/booking')
            .send({name: "This is a test booking"})
            .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NTAyNTM3MDg3ODYsInVzZXJuYW1lIjoiaGFzYW5odEBnbWFpbC5jb20ifQ.ae_Jpo26oEvBMz-H0qyNeBmFxzbgXM0QbmfLZKJm_JQ')
            .end(function(err, res){
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                done();
            });
    });

    it('should list a SINGLE booking on /booking/:id GET', function(done){
        var newBooking = new Booking({
            name: 'New booking'
        });

        newBooking.save(function(err, data) {
            chai.request(server)
                .get('/v1/booking/'+ data.id)
                .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NTAyNTM3MDg3ODYsInVzZXJuYW1lIjoiaGFzYW5odEBnbWFpbC5jb20ifQ.ae_Jpo26oEvBMz-H0qyNeBmFxzbgXM0QbmfLZKJm_JQ')
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.name.should.equal('New booking');
                    res.body._id.should.equal(data.id);
                    done();
                });
        });

    });

    //it('should update a SINGLE booking on /booking/<id> PUT');
    //it('should delete a SINGLE booking on /booking/<id> DELETE');
});
