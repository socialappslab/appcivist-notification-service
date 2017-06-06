var should = require('should');
var assert = require('assert');
var request = require('supertest');
var dbutils = require('../lib/dbutils.js');
var newsFlash6id;
var app = require('../server');

/*

Signals look like this:

  {
     "eventTitle": "Large meteor strikes the moon",
     "instancedata": "This one weighed more than 16 megatons!!"
  }

*/


describe('Routing', function() {
    var url = 'http://localhost:3025';

    before(function(done) {
        dbutils.cleardb(function() {
            done();
        });
    });


    //Create events
    //
    describe('Signals', function() {
        it('should successfully create a new event', function(done) {
            var profile = {
                eventId: '12345_new_campaign'
            };
            request(url)
                .post('/events')
                .send(profile)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should successfully create another new event', function(done) {
            var profile = {
                eventId: '123456_new_campaign'
            };
            request(url)
                .post('/events')
                .send(profile)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should successfully create even another new event', function(done) {
            var profile = {
                eventId: '1234567_new_campaign'
            };
            request(url)
                .post('/events')
                .send(profile)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });

        //Create subscriptions

        it('should successfully create a new subscription with email as endpointType', function(done) {
            var profile = {
                eventId: '12345_new_campaign',
                alertEndpoint: 'kjoewill@gmail.com',
                endpointType: 'email'
            };
            request(url)
                .post('/subscriptions')
                .send(profile)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should successfully create another new subscription with email as endpointType', function(done) {
            var profile = {
                eventId: '12345_new_campaign',
                alertEndpoint: 'kjwillia@us.ibm.com',
                endpointType: 'email'
            };
            request(url)
                .post('/subscriptions')
                .send(profile)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should successfully create another new subscription with usbn as endpointType', function(done) {
            var profile = {
                eventId: '12345_new_campaign',
                alertEndpoint: 'usnbuser@us.ibm.com',
                endpointType: 'usnb'
            };
            request(url)
                .post('/subscriptions')
                .send(profile)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should successfully create even another new subscription', function(done) {
            var profile = {
                eventId: '123456_new_campaign',
                alertEndpoint: 'kjoewill@gmail.com'
            };
            request(url)
                .post('/subscriptions')
                .send(profile)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });

        //Signal tests
        //
        it('should signal one event and trigger two notifications', function(done) {
            var profile = {
                eventId: '12345_new_campaign',
                instancedata: 'An instance of event(12345_new_campaign) has happened'
            };
            request(url)
                .post('/signals')
                .send(profile)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(3);
                    eventsArray = JSON.parse(res.text);
                    //two email users
                    assert.equal(eventsArray[0].alertEndpoint, 'kjoewill@gmail.com');
                    assert.equal(eventsArray[0].eventId, '12345_new_campaign');
                    assert.equal(eventsArray[1].alertEndpoint, 'kjwillia@us.ibm.com');
                    assert.equal(eventsArray[1].eventId, '12345_new_campaign');
                    //one usnb user
                    assert.equal(eventsArray[2].alertEndpoint, 'usnbuser@us.ibm.com');
                    assert.equal(eventsArray[2].eventId, '12345_new_campaign');

                    done();
                });
        });

        it('should signal one event and trigger two notifications filtered by email', function(done) {
            var profile = {
                eventId: '12345_new_campaign',
                instancedata: 'An instance of event(12345_new_campaign) has happened',
                filterBy: 'email'
            };
            request(url)
                .post('/signals')
                .send(profile)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(2);
                    eventsArray = JSON.parse(res.text);
                    assert.equal(eventsArray[0].alertEndpoint, 'kjoewill@gmail.com');
                    assert.equal(eventsArray[0].eventId, '12345_new_campaign');
                    assert.equal(eventsArray[1].alertEndpoint, 'kjwillia@us.ibm.com');
                    assert.equal(eventsArray[1].eventId, '12345_new_campaign');

                    done();
                });
        });

        //Event signal log tests
        //
        it('should retreive one log entry', function(done) {
            request(url)
                .get('/signallog')
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    res.body.should.have.lengthOf(2);
                    eventsArray = JSON.parse(res.text);
                    assert.equal(eventsArray[0].eventId, '12345_new_campaign');
                    done();
                });
        });


    });
});
