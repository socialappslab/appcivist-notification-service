var mongo = require('mongodb').MongoClient;
var mongoclass = require('mongodb');
//mongo.BSONPure = require('bson').BSONPure;

//var BSON = mongo.BSONPure;
var BSON = mongoclass;

/*

Subscriptions look like this in JSON

  {
    "eventId": "12345_new_campaign",
    "alertEndpoint": "kjoewill@gmail.com",
    "endpointType": "email",
    "_id": "521a5af259b05b8099000002"
  }

*/


exports.findById = (req, res) => {
    var id = req.params.id;
    console.log("Looking up subscription with id = " + id);

    var db = req.app.get('db');
    var collection = db.collection('subscriptions');
    collection.findOne({
        '_id': new BSON.ObjectID(id)
    }, (err, item) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(item);
        }
    });
}

//=> GET `/subscription/user/:userId` => Returns all subscriptions of `userId`
exports.findByUserId = (req, res) => {
    var id = req.params.userId;
    console.log("Looking up subscription of Userid = " + id);

    var db = req.app.get('db');
    var collection = db.collection('subscriptions');
    var query = {
        'userId':parseInt(id)
    }
    collection.find(query).toArray((err, items) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(items);
        }
    });
}

//=> GET `/subscription/entity/:entityId/user/:userId/:entityId` => Returns specific subscription
exports.findByUserEntity = (req, res) => {
    var userId = req.params.userId;
    var entityId = req.params.entityId;

    console.log("Looking up subscription of Userid = " + userId + " Entity: " + entityId);

    var db = req.app.get('db');
    var collection = db.collection('subscriptions');
    var query = {
        'userId':parseInt(userId),
        'spaceId':entityId
    }
    console.log("Looking criteria = " );
    console.log(query);

    collection.find(query).toArray((err, items) => {
        if (err) {
            res.status(500).send(err);
        } else {
            console.log("Results found = " + items);

            res.send(items);
        }
    });
}

//PUT an existing subscription by `userId`, `entityId` and `type`
exports.findByEntity = (req, res) => {
    var entityId = req.params.entityId;

    console.log("Looking up subscription of Entity: " + entityId);

    var db = req.app.get('db');
    var collection = db.collection('subscriptions');
    var query = {
        'spaceId':entityId
    }
    collection.find(query).toArray((err, items) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(items);
        }
    });
}

//=> GET `/subscription/entity/:entityId` => Returns all subscriptions to `entityId`
/*
{
   "id" : 999,
   "userId": "user UUID in AppCivist",
   "spaceId": "UUID of the resource space of a campaign, contribution, assembly, or WG, for which events are notified",
   "spaceType": "CAMPAIGN | CONTRIBUTION | ASSEMBLY | WORKING_GROUP",
   "subscriptionType": "REGULAR | NEWSLETTER",
   "newsletterFrequency": 7,
   "ignoredEvents": { 
       "UPDATED_CAMPAIGN_CONFIGS": true  
   },
   "disabledServices": {
        "facebook-messenger: true
   }, 
   "defaultService": "<an override of preferences for future, null by default>", 
   "defaultIdentity": "<an override of preferences for future, null by default>"
}
*/
exports.updateByEntityUserType = (req, res) => {
    var entityId = req.params.entityId;

    console.log("Looking up subscription of Entity: " + entityId);

    var db = req.app.get('db');
    var collection = db.collection('subscriptions');
    var criteria ={
        userId : req.body.userId,
        spaceId : req.body.spaceId,
        subscriptionType: req.body.subscriptionType
    }
    var updateCriteria ={
        $set:{
            subscriptionType: req.body.subscriptionType,
            newsletterFrequency: req.body.newsletterFrequency,
            ignoredEvents: req.body.ignoredEvents,
            disabledServices: req.body.disabledServices,
            defaultService: req.body.defaultService,
            defaultIdentity: req.body.defaultIdentity
        }
    };
    
   
    collection.update(criteria, updateCriteria, (err, result) => {
            if (err){
                console.log('Error Updating Identity');
                res.status(500).send(err);
            }else{
                console.log('Updating Identity. OK');
                res.send(result[0]);
            }
            
    });
}

exports.deleteByEntityUserType = (req, res) => {
    var entityId = req.params.entityId;

    console.log("Looking up subscription of Entity: " + entityId);

    var db = req.app.get('db');
    var collection = db.collection('subscriptions');
    var criteria ={
        userId : req.body.userId,
        spaceId : req.body.spaceId,
        subscriptionType: req.body.subscriptionType
    }
    
    collection.remove(criteria, 
        {
            safe: true
        }, 
        (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(req.body);
            }
        });

}



exports.findAll = (req, res) => {
    db = req.app.get('db');
    var collection = db.collection('subscriptions');
    collection.find().toArray((err, items) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(items);
        }
    });
}

exports.addSubscription = (req, res) => {
    console.log("Creating subscription: " + req.body);

    var subscription = req.body;
    var db = req.app.get('db');
    var collection = db.collection('subscriptions');
    collection.findOne({
        userId : req.body.userId,
        spaceId : req.body.spaceId,
        subscriptionType: req.body.subscriptionType
        },
        (err, item) => {
            if (item != null && item != undefined) {
                console.log("Subscription already exists");
                res.status(201).send("Subscription already exists");
            } else {
                collection.insert(subscription, (err, result) => {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.send(result[0]);
                    }
                });
            }
        });
}

exports.updateSubscription = (req, res) => {
    var id = req.params.id;
    var subscription = req.body;

    var db = req.app.get('db');
    var collection = db.collection('subscriptions');
    collection.update({
        '_id': new BSON.ObjectID(id)
    }, subscription, {
        safe: true
    }, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(subscription);
        }
    });
}

exports.deleteSubscription = (req, res) => {
    var id = req.params.id;

    var db = req.app.get('db');
    var collection = db.collection('subscriptions');
    collection.remove({
        '_id': new BSON.ObjectID(id)
    }, {
        safe: true
    }, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(req.body);
        }
    });
}

exports.findByEventIdAndAlert = (req, res) => {
    console.log("Request = " + JSON.stringify(req.params));
    var eid = req.params.eid;
    var alert = req.params.alert;
    console.log("Looking up subscription with eventId = " + eid + " and alertEndpoint = " + alert);

    var db = req.app.get('db');
    var collection = db.collection('subscriptions');
    collection.findOne({
        'eventId': eid,
        'alertEndpoint': alert
    }, (err, item) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(item);
        }
    });
}

exports.findByAlertEndpoint = (req, res) => {
    console.log("Request = " + JSON.stringify(req.params));
    var alert = req.params.alert;
    console.log("Looking up subscription with alertEndpoint = " + alert);

    var db = req.app.get('db');
    var collection = db.collection('subscriptions');
    collection.find({
        'alertEndpoint': alert
    }).toArray((err, items) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(items);
        }
    });
}

exports.updateSubscriptionByEventIdAndAlert = (req, res) => {
    var eid = req.params.eid;
    var alert = req.params.alert;
    var subscription = req.body;

    var db = req.app.get('db');
    var collection = db.collection('subscriptions');
    collection.update({
        'eventId': eid,
        'alertEndpoint': alert
    }, subscription, {
        safe: true
    }, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(subscription);
        }
    });
}

exports.deleteSubscriptionByEventIdAndAlert = function(req, res) {
    var eid = req.params.eid;
    var alert = req.params.alert;

    db = req.app.get('db');
    var collection = db.collection('subscriptions');
    collection.remove({
        'eventId': eid,
        'alertEndpoint': alert
    }, {
        safe: true
    }, function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(req.body);
        }
    });
}
