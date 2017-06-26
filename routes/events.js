var mongo = require('mongodb').MongoClient;
//var mongoclass = require('mongodb');
//var BSON = require('bson').BSONPure
var ObjectID = require('mongodb').ObjectID;
//var BSON = mongoclass;
/*
Events look like this in JSON

  {
    "eventId": "news_flash",
    "title": "News flash 6",
    "_id": "521d8970a1b6cd31a3000001"
  }
*/


exports.findById = (req, res) => {
    var id = req.params.id;
    console.log('findById ' + id);
    var db = req.app.get('db');
    var collection = db.collection('events');
    collection.findOne({
        '_id': new ObjectID(id)
    }, (err, item) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(item);
        }
    });
}


exports.findAll = (req, res) => {
    var db = req.app.get('db');
    var collection = db.collection('events');
    collection.find().toArray((err, items) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(items);
        }
    });
}

exports.addEvent = (req, res) => {
    console.log('add event');
    var event = req.body;
    var db = req.app.get('db');
    var collection = db.collection('events');
    collection.insert(event, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result[0]);
        }
    });
}

exports.updateEvent = (req, res) => {
    var id = req.params.id;
    var event = req.body;
    var db = req.app.get('db');
    var collection = db.collection('events');
    collection.update({
        //'_id': new BSON.ObjectID(id)
        '_id': new ObjectID(id)
    }, event, {
        safe: true
    }, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(event);
        }
    });
}

exports.deleteEvent = (req, res) => {
    var id = req.params.id;
    var db = req.app.get('db');
    var collection = db.collection('events');
    collection.remove({
        //'_id': new BSON.ObjectID(id)
        '_id': new ObjectID(id)
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
