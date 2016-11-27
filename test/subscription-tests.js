var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var dbutils = require('../lib/dbutils.js');
var newsFlash6id;
 
/*

Subscriptions look like this in JSON

  {
    "eventId": "12345_NEW_CONTRIBUTION_IDEA",
    "alertEndpoint": "kjoewill@gmail.com",
    "endpointType": "email",
    "origin": "12345",
    "eventName":"NEW_CONTRIBUTION_IDEA",
    "_id": "521a5af259b05b8099000002"
  }

*/



describe('Routing', function() {
  var url = 'http://localhost:3025';

  before(function(done) {
    dbutils.cleardb(function(){done();});
  });

  //Create tests
  //
  describe('Subscription', function() {
    it('should successfully create a new subscription', function(done) {
      var profile = {
        eventId: "12345_NEW_CONTRIBUTION_IDEA",
        alertEndpoint:'angarita.rafael@gmail.com',
        endpointType:'email',
        origin:'12345',
        eventName:'NEW_CONTRIBUTION_IDEA'
      };
    request(url)
	.post('/subscriptions')
	.send(profile)
	.end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status',200);
          done();
        });
    });

    it('should successfully create another new subscription', function(done) {
      var profile = {
        eventId: '12345_NEW_CONTRIBUTION_PROPOSAL',
        alertEndpoint:'angarita.rafael@gmail.com',
        endpointType:'email',
        origin:'12345',
        eventName:'NEW_CONTRIBUTION_PROPOSAL'
      };
    request(url)
	.post('/subscriptions')
	.send(profile)
	.end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status',200);
          done();
        });
    });

    it('should successfully create even another new subscription', function(done) {
      var profile = {
        eventId: "12345_NEW_CONTRIBUTION_NOTE",
        alertEndpoint:'angarita.rafael@gmail.com',
        endpointType:'email',
        origin:'12345',
        eventName:'NEW_CONTRIBUTION_NOTE'      
      };
    request(url)
	.post('/subscriptions')
	.send(profile)
	.end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status',200);
          done();
        });
    });

    //Read tests
    //
    it('should return three subscriptions', function(done) {
    request(url)
	.get('/subscriptions')
	.end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status',200);
          res.body.should.have.lengthOf(3);
          subsArray = JSON.parse(res.text);
          assert.equal(subsArray[0].eventId, '12345_NEW_CONTRIBUTION_IDEA');
          assert.equal(subsArray[0].alertEndpoint, 'angarita.rafael@gmail.com');
          assert.equal(subsArray[1].eventId, '12345_NEW_CONTRIBUTION_PROPOSAL');
          assert.equal(subsArray[1].alertEndpoint, 'angarita.rafael@gmail.com');
          assert.equal(subsArray[2].eventId, '12345_NEW_CONTRIBUTION_NOTE');
          assert.equal(subsArray[2].alertEndpoint, 'angarita.rafael@gmail.com');

          newsFlash6id = subsArray[0]._id;
          done();
        });
    });

    it('should return news flash 6 subscription', function(done) {
    request(url)
	.get('/subscriptions/'+ newsFlash6id)
	.end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status',200);
          res.body.should.have.property('eventId');
          res.body.eventId.should.equal('12345_NEW_CONTRIBUTION_IDEA');
          res.body.alertEndpoint.should.equal('angarita.rafael@gmail.com');
          done();
        });
    });

    it('should return news flash 6 subscription based on eventId and alertEndpoint', function(done) {
    request(url)
  .get('/subscriptions/12345_NEW_CONTRIBUTION_IDEA/angarita.rafael@gmail.com')
  .end(function(err, res) {
          if (err) {
            throw err;
          }
          console.log('Body = '+JSON.stringify(res.body));
          res.should.have.property('status',200);
          res.body.should.have.property('eventId');
          res.body.eventId.should.equal('12345_NEW_CONTRIBUTION_IDEA');
          res.body.alertEndpoint.should.equal('angarita.rafael@gmail.com');
          done();
        });
    });

    //Update Tests
    //

    it('should successfully update a specific subscription', function(done) {
      var profile = {
        eventId: '12345_NEW_CONTRIBUTION_IDEA',
        alertEndpoint: 'kjoewill@phonyemail.com'
      };
    request(url)
	.put('/subscriptions/'+ newsFlash6id)
	.send(profile)
	.end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status',200);
          done();
        });
    });

    it('should verify revised News flash 6 subscription', function(done) {
    request(url)
	.get('/subscriptions/'+ newsFlash6id)
	.end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status',200);
          res.body.should.have.property('eventId');
          res.body.should.have.property('alertEndpoint');
          res.body.eventId.should.equal('12345_NEW_CONTRIBUTION_IDEA');
          res.body.alertEndpoint.should.equal('kjoewill@phonyemail.com');
          done();
        });
    });


    it('should successfully update a specific subscription', function(done) {
      var profile = {
        eventId: '12345_NEW_CONTRIBUTION_IDEA',
        alertEndpoint: 'kjoewill1@phonyemail.com'
      };
    request(url)
  .put('/subscriptions/12345_NEW_CONTRIBUTION_IDEA/kjoewill@phonyemail.com')
  .send(profile)
  .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status',200);
          done();
        });
    });

    it('should verify revised News flash 6 subscription by eventId and alertEndpoint', function(done) {
    request(url)
  .get('/subscriptions/12345_NEW_CONTRIBUTION_IDEA/kjoewill1@phonyemail.com')
  .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status',200);
          res.body.should.have.property('eventId');
          res.body.should.have.property('alertEndpoint');
          res.body.eventId.should.equal('12345_NEW_CONTRIBUTION_IDEA');
          res.body.alertEndpoint.should.equal('kjoewill1@phonyemail.com');
          done();
        });
    });

    //Delete tests
    //
    it('should delete revised News flash 6 subscription', function(done) {
    request(url)
	.del('/subscriptions/'+ newsFlash6id)
	.end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status',200);
          done();
        });
    });

    it('should now return two not-deleted subscriptions', function(done) {
    request(url)
	.get('/subscriptions')
	.end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status',200);
          res.body.should.have.lengthOf(2);
          subsArray = JSON.parse(res.text);
          assert.equal(subsArray[0].eventId, '12345_NEW_CONTRIBUTION_PROPOSAL');
          assert.equal(subsArray[0].alertEndpoint, 'angarita.rafael@gmail.com');
          assert.equal(subsArray[1].eventId, '12345_NEW_CONTRIBUTION_NOTE');
          assert.equal(subsArray[1].alertEndpoint, 'angarita.rafael@gmail.com');
          done();
        });
    });

    it('should delete revised News flash 6 subscription by eventId and alertEndpoint', function(done) {
    request(url)
  .del('/subscriptions/12345_NEW_CONTRIBUTION_PROPOSAL/angarita.rafael@gmail.com')
  .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status',200);
          done();
        });
    });

    it('should now return one not-deleted subscriptions', function(done) {
    request(url)
  .get('/subscriptions')
  .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status',200);
          res.body.should.have.lengthOf(1);
          subsArray = JSON.parse(res.text);
          assert.equal(subsArray[0].eventId, '12345_NEW_CONTRIBUTION_NOTE');
          assert.equal(subsArray[0].alertEndpoint, 'angarita.rafael@gmail.com');
          done();
        });
    });
  });
});
