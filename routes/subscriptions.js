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
    //TODO: check if the 'endpointType' is a valid one
    var subscription = req.body;
    var db = req.app.get('db');
    var collection = db.collection('subscriptions');
    collection.findOne({
            'eventId': subscription.eventId,
            'alertEndpoint': subscription.alertEndpoint
        },
        (err, item) => {
            if (item != null && item != undefined) {
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
