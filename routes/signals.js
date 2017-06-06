var BSON = require('bson').BSONPure;

var _ = require('underscore');

var request = require('request');
var Message = require('scb-node-parser/message');
var sender = require('../amqp-sender');

/*
Signals look like this:
  {
     "eventId": "12345_new_campaign",
     "eventTitle": "A New CAMPAIGN in City of Vallejo",
     "text": "Check out this new",
     "data": "{JSON-DATA}" //additional data
     "filterBy": "email" //only signals subscriptions associated with this service
  }
*/

/**
 * Process the signal for a specific subscription
 * @param subscription
 * @param signal
 */
function processMatch(subscription, signal) {
    console.log('subscription: ', subscription);
    console.log('signal: ', signal);
    var message = new Message({
        name: subscription.alertEndpoint,
        uniqueName: subscription.alertEndpoint
    }, {
        name: 'AppCivist',
        uniqueName: 'AppCivist'
    }, signal.title, signal.text);

    //TODO: if subscription.endpointType === 'usnb', get all services
    //associated with that user and send the message to the USNB?
    sender.post(message, subscription.endpointType);

}

exports.processSignal = (req, res) => {
    var signal = req.body;
    console.log('Processing Signal: ' + JSON.stringify(signal));

    db = req.app.get('db');
    var collection = db.collection('subscriptions');
    collection.find().toArray((err, items) => {
        if (err) {
            res.status(500).send(err);
        } else {
            matches = _.filter(items, (sub) => {
                console.log('filterBy :' + signal.filterBy);
                if (signal.filterBy && typeof signal.filterBy != 'undefined')
                    return sub.eventId === signal.eventId &&
                        signal.filterBy === sub.endpointType;
                else
                    return sub.eventId === signal.eventId;
            });
            _.each(matches, (sub) => {
                processMatch(sub, signal)
            });
            res.send(matches);
        }
    });

    // Log reception of the signal
    var collection = db.collection('signalLog');
    collection.insert(signal, (err, result) => {
        if (err) {
            console.log(err);
        }
    });
}
