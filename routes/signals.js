var BSON = require('bson').BSONPure;

var _ = require('underscore');

var request = require('request');
var Message = require('scb-node-parser/message');
var sender = require('../amqp-sender');
var entityMangerHost = (process.env.USNB_ENTITY_MANAGER_HOST);
var axios = require('axios');
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
    var user={};
    var url = entityMangerHost+'/identities/'+subscription.userId;

    // Make a request for a user with a given ID
    console.log("Getting entities from: " + url);
    axios.get(url)
      .then(function (entities) {
        //process entities 
       
        console.log("Founded identities: ");
        console.log(entities.data);
        if(subscription.defaultService == undefined && entities.data != undefined){
            entities.data.forEach(function(entity){
             console.log("Founded identity: ");
             console.log(entity);
              if(entity.enabled){

                var message = new Message(
                    {
                    name: entity.identity,
                    uniqueName: entity.identity,
                    }, 
                    {
                        name: 'AppCivist',
                        uniqueName: 'AppCivist'
                    }, 
                    signal.title, signal.text);
                    console.log("Sending message to RabbitMQ: " +message )
                    //TODO: if subscription.endpointType === 'usnb', get all services
                    //associated with that user and send the message to the USNB?
                    sender.post(message, entity.serviceId);
              }
            });
        }

      })
      .catch(function (error) {
        console.log(error);
      });
    

}

exports.processSignal = (req, res) => {
    var signal = req.body;
    console.log('Processing Signal: ' + JSON.stringify(signal));

    db = req.app.get('db');
    var collection = db.collection('subscriptions');
    var eventName = 'ignoredEventsList.' + signal.eventName;

    
    var query1={
        'spaceType':signal.spaceType,
        'spaceId':signal.spaceId,
        'subscriptionType': signal.signalType,
        eventName:false

    }

    var query2={
        'spaceType':signal.spaceType,
        'spaceId':signal.spaceId,
        'subscriptionType': signal.signalType,
        eventName:null

    }

    var query = {
        $or : [
            query1,
            query2
        ]
    }
    console.log('Finding subscriptions like: ' + JSON.stringify(query));

    collection.find(query).toArray((err, items) => {
        if (err) {
            res.status(500).send(err);
        } else {

            _.each(items, (sub) => {
                processMatch(sub, signal)
            });
            res.send(items);
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
