var mongo = require('mongodb').MongoClient;
mongo.BSONPure = require('bson').BSONPure;
var BSON = mongo.BSONPure;

var dbutils = require('../lib/dbutils.js');
var mongoUri = dbutils.mongoUri;

var _ = require('underscore');

var request = require('request');
var conf = require('../conf/conf');

/*
Signals look like this:
  {
     "eventId": "12345_new_campaign",
     "eventTitle": "A New CAMPAIGN in City of Vallejo",
     "text": "Check out this new",
     "data": "{JSON-DATA}"
  }
*/

/**
 * Process the signal for a specific subscription
 * TODO: as of now, it simply sends the notification to the email service, in the future we should process each subscription depending on the type
 * @param subscription
 * @param signal
 */
function processMatch(subscription, signal) {
    console.log('subscriptions: ', subscription);
    console.log('signal: ', signal);
    // TODO: send the signal in the social bus to let the app know
    request.post(
        'http://' + conf.host, {
            json: {
		        'destination':'email',
                'to': '["' + subscription.alertEndpoint + '"]',
        	    'from':"AppCivist Bot <bot@appcivist.org>",
		        'subject': signal.title,
                'text': signal.text
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
                return sub.eventId == signal.eventId
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
