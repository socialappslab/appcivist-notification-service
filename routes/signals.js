var mongo = require('mongodb').MongoClient;
var BSON = mongo.BSONPure;

var dbutils = require('../lib/dbutils.js');
var mongoUri = dbutils.mongoUri;

var _ = require('underscore');

var request = require('request');
var conf = require('../conf/conf');

/*

Signals look like this:

  {
     "eventTitle": "Large meteor strikes the moon",
     "instancedata": "This one weighed more than 16 megatons!!"
  }


*/






function processMatch(subscription, signal) {
    console.log('subscriptions: ', subscription);
    console.log('signal: ', signal);
    request.post(
        'http://' + conf.host, {
            json: {
		'destination':'email',
                'to': '["' + subscription.alertEndpoint + '"]',
        	"from":"AppCivist Bot <bot@appcivist.org>",
		'subject': subscription.eventTitle,
        	'text': signal.instancedata
            }
        },
        function(error, response, body) {
            //console.log(response);
	    //console.log(error);
	    if (!error && response.statusCode == 200) {
               console.log(body)
            }
        }
    );

}






exports.processSignal = function(req, res) {
    var signal = req.body;
    console.log('Processing Signal: ' + JSON.stringify(signal));

    mongo.connect(mongoUri, function(err, db) {
        var collection = db.collection('subscriptions');
        collection.find().toArray(function(err, items) {
            matches = _.filter(items, function(sub) {
                return sub.eventTitle == signal.eventTitle
            });
            _.each(matches, function(sub) {
                processMatch(sub, signal)
            });
            res.send(matches);
        });
    });

    // Log reception of the signal
    mongo.connect(mongoUri, function(err, db) {
        var collection = db.collection('signalLog');
        collection.insert(signal, function(err, result) {
            db.close();
        });
    });

}
