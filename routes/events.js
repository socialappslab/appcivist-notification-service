var mongo = require('mongodb').MongoClient;
mongo.BSONPure = require('bson').BSONPure;
var BSON = mongo.BSONPure;

var dbutils = require('../lib/dbutils.js');
var mongoUri = dbutils.mongoUri;

/*
Events look like this in JSON

  {
    "eventId": "news_flash",
    "title": "News flash 6",
    "_id": "521d8970a1b6cd31a3000001"
  }
*/


exports.findById = function(req, res) {
  var id = req.params.id;

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('events');
    collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
      res.send(item);
      db.close();
    });
  });
}

 
exports.findAll = function(req, res) {

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('events');
    collection.find().toArray(function(err, items) {
      res.send(items);
      db.close();
    });
  });
}
 
exports.addEvent = function(req, res) {
  var event = req.body;

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('events');
    collection.insert(event, function(err, result) {
        res.send(result[0]);
        db.close();
  	});
   
  });
}
 
exports.updateEvent = function(req, res) {
  var id = req.params.id;
  var event = req.body;

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('events');
    collection.update({'_id':new BSON.ObjectID(id)}, event, {safe:true}, function(err, result) {
      res.send(event);
      db.close();
    });
  });
}
 
exports.deleteEvent = function(req, res) {
  var id = req.params.id;

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('events');
    collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
      res.send(req.body);
      db.close();
    });
  });
}
 