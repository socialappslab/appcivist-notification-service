var mongo = require('mongodb').MongoClient;
var dbutils = require('../lib/dbutils.js');
var mongoUri = dbutils.mongoUri;

exports.findRecent = function(req, res) {

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('signalLog');
      collection.find().sort({_id:-1}).limit(5).toArray(function(err, items) {
        res.send(items);
        db.close();
      });
  });
}
 