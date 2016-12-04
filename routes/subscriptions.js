var mongo = require('mongodb').MongoClient;
mongo.BSONPure = require('bson').BSONPure;
var BSON = mongo.BSONPure;

var dbutils = require('../lib/dbutils.js');
var mongoUri = dbutils.mongoUri; 

/*

Subscriptions look like this in JSON

  {
    "eventId": "12345_new_campaign",
    "alertEndpoint": "kjoewill@gmail.com",
    "type": "email",
    "_id": "521a5af259b05b8099000002"
  }

*/


exports.findById = function(req, res) {
  var id = req.params.id;
  console.log("Looking up subscription with id = "+id);

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('subscriptions');           
    collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
        res.send(item);
        db.close();
      });
  });
}
 
exports.findAll = function(req, res) {

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('subscriptions');
    collection.find().toArray(function(err, items) {
        res.send(items);
        db.close();
    });
 });
}
 
exports.addSubscription = function(req, res) {
  var subscription = req.body;

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('subscriptions');    
    collection.findOne({'eventId': subscription.eventId, 'alertEndpoint': subscription.alertEndpoint}, 
      function(err, item) {
        if (item!=null && item !=undefined) {
          res.status(201).send("Subscription already exist");
          db.close();
        } else {
          collection.insert(subscription, function(err, result) {
            res.send(result[0]);
            db.close();
          });
        }
      });
  });
}
 
exports.updateSubscription = function(req, res) {
  var id = req.params.id;
  var subscription = req.body;

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('subscriptions');
      collection.update({'_id':new BSON.ObjectID(id)}, subscription, {safe:true}, function(err, result) {
        res.send(subscription);
        db.close();
      });
  });
}
 
exports.deleteSubscription = function(req, res) {
  var id = req.params.id;

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('subscriptions');
      collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
        res.send(req.body);
        db.close()
      });
  });
}

exports.findByEventIdAndAlert = function(req, res) {
 console.log("Request = "+JSON.stringify(req.params));
 var eid = req.params.eid;
 var alert = req.params.alert;
 console.log("Looking up subscription with eventId = "+eid+" and alertEndpoint = "+alert);

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('subscriptions');           
    collection.findOne({'eventId': eid, 'alertEndpoint': alert}, function(err, item) {
        res.send(item);
        db.close();
      });
  });
}

exports.findByAlertEndpoint = function(req, res) {
 console.log("Request = "+JSON.stringify(req.params));
 var alert = req.params.alert;
 console.log("Looking up subscription with alertEndpoint = "+alert);

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('subscriptions'); 
    collection.find({'alertEndpoint': alert}).toArray(function(err, items) {
        res.send(items);
        db.close();
      });
  });
}

exports.updateSubscriptionByEventIdAndAlert = function(req, res) {
  var eid = req.params.eid;
  var alert = req.params.alert;
  var subscription = req.body;

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('subscriptions');
      collection.update({'eventId': eid, 'alertEndpoint': alert}, subscription, {safe:true}, function(err, result) {
        res.send(subscription);
        db.close();
      });
  });
}
 
exports.deleteSubscriptionByEventIdAndAlert = function(req, res) {
  var eid = req.params.eid;
  var alert = req.params.alert;

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('subscriptions');
      collection.remove({'eventId': eid, 'alertEndpoint': alert}, {safe:true}, function(err, result) {
        res.send(req.body);
        db.close()
      });
  });
}


 
