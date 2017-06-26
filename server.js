var express = require('express');
var event = require('./routes/events');
var sub = require('./routes/subscriptions');
var signal = require('./routes/signals');
var signallog = require('./routes/signallog');
var logger = require('morgan');
var bodyParser = require('body-parser');

var mongo = require('mongodb').MongoClient;
mongo.BSONPure = require('bson').BSONPure;
var BSON = require('bson').BSONPure;
var dbutils = require('./lib/dbutils.js');
var mongoUri = process.env.USNB_MONGO_URI_NOTIFICATIONS;

var port = (process.env.USNB_NOTIFICATIONS_PORT);

var app = express();

mongo.connect(mongoUri, (err, database) => {
    if (err) {
        console.log('err');
        throw err;
    }
    app.set('db', database);

    console.log('About to start listening');
    app.listen(port);
    console.log('Listening on port: ', port);
});

app.use(logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser.json());

console.log('registering event routes with express');
app.get('/events', event.findAll);
app.get('/events/:id', event.findById);
app.post('/events', event.addEvent);
app.put('/events/:id', event.updateEvent);
app.delete('/events/:id', event.deleteEvent);

console.log('registering subscription routes with express');
app.get('/subscriptions', sub.findAll);
app.get('/subscriptions/endpoint/:alert', sub.findByAlertEndpoint);
app.get('/subscriptions/:id', sub.findById);
app.post('/subscriptions', sub.addSubscription);
app.put('/subscriptions/:id', sub.updateSubscription);
app.delete('/subscriptions/:id', sub.deleteSubscription);
app.get('/subscriptions/:eid/:alert', sub.findByEventIdAndAlert);
app.put('/subscriptions/:eid/:alert', sub.updateSubscriptionByEventIdAndAlert);
app.delete('/subscriptions/:eid/:alert', sub.deleteSubscriptionByEventIdAndAlert);

console.log('registering signal routes with express');
app.post('/signals', signal.processSignal);

console.log('registering log routes with express');
app.get('/signallog', signallog.findRecent);
