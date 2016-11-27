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
    collection.insert(subscription, function(err, result) {
        res.send(result[0]);
        db.close();
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
 
