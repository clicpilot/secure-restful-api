var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);


/* describe() is used for grouping tests in a logical manner. */
describe('Test Bookings', function() {

    // it() statements contain each individual test case, which generally (err, should) test a single feature
    it('should list ALL bookings on /v1/bookings GET');
    it('should list a SINGLE booking on /booking/<id> GET');
    it('should add a SINGLE booking on /bookings POST');
    it('should update a SINGLE booking on /booking/<id> PUT');
    it('should delete a SINGLE booking on /booking/<id> DELETE');
});