var mongo = require('mongodb').MongoClient;
var BSON = mongo.BSONPure;

var dbutils = require('../lib/dbutils.js');
var mongoUri = dbutils.mongoUri;
 
var mailer = require('../lib/mailer.js');
var _ = require ('underscore');
 
/*

Signals look like this:

  {
     "eventTitle": "Large meteor strikes the moon",
     "instancedata": "This one weighed more than 16 megatons!!"
  }


*/


function processMatch(subscription, signal) {

   opts = {
     from: 'Simple Notification Service <kjwnotificationservice@gmail.com>',
     to: subscription.alertEndpoint,
     subject: subscription.eventTitle + ' happened at: ' + new Date(),
     body: signal.instancedata
   }
   // Send alert
   mailer.sendMail(opts);

}

  
exports.processSignal = function(req, res) {
    var signal = req.body;
    console.log('Processing Signal: ' + JSON.stringify(signal));

  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('subscriptions');
      collection.find().toArray(function(err, items) {
        matches = _.filter(items, function(sub){return sub.eventTitle == signal.eventTitle});
        _.each(matches, function (sub) {processMatch(sub, signal)});
        res.send(matches);
      });   
  });
  
  // Log reception of the signal
  mongo.connect(mongoUri, function (err, db) {
    var collection = db.collection('signalLog');
      collection.insert(signal, function(err, result) {
        db.close();
      });
  });

}
 
 