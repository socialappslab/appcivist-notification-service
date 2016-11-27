# Simple Notification Service - Overview

**Observation:** The following documentation is based on the original documentation available [here](https://github.com/kjoewill/notification-service/wiki/Home/)

## What it does

This  prototype is a functioning, but very simple - notification service that allows clients (humans or machines) to create Events, Subscribe to Event occurrences and receive notifications when event instances happen.  An example usage is a system tester (or test automation) being notified that a specific build has passed acceptance test.  Any potential event can be created and subscribed to and , as long as a mechanism is in place to signal an occurrence of the event - via the services API -  then all subscribers will receive notification. 

The service API provides the ability to define Events, subscribe to Events and signal Event occurrences.

## What (and where) it is
This service runs as a node.js application and provides a rest-based API to clients.  All data that passes through this API is JSON format.  Data is persisted to a document oriented database ... MongoDB.  For initial use I have hosted this prototype on the IBM BlueMix cloud and also verified it works well on Heroku. 
## Setup
### Install node  
I have been using v0.10.15 for initial development and testing
### Install MongoDB and create collection
I have been using v2.4.5 for initial development and testing
Run mongo: 
```
mongod &
```

Create collection in mongo: 
```
mongo
db.createCollection('notificationservice')
```

### Pull from GitHub
Get a local copy of the project (using git or copy the zip) and then use the node package manager to install needed prereqs defined in package.json ...
```
npm install
```
then create a file named "config.js" file for your mail server account and drop it in the ./lib folder.  It looks like this:
<code>
module.exports = {
  email: 'someaccount@gmail.com',
  password: 'somepwd'
}
</code>

then start the server ...
```
node server.js
```
with the server running you can launch the test suite from a separate shell ...
```
./node_modules/mocha/bin/mocha
```

## API
The API is REST-based. All data exchanged is JSON.  For illustrative purpose API calls are shown in the context of cURL commands.

The following APIs support the primary use cases

### Create an Event
```
curl -i -X POST -H 'Content-Type: application/json' -d '{"eventId" : "1234_NEW_CONTRIBUTION_IDEA", "title": "New IDEA"}' http://<hostname>/events
```

### Subscribe to an Event
```
curl -i -X POST -H 'Content-Type: application/json' -d '{"eventId": "1234_NEW_CONTRIBUTION_IDEA", "alertEndpoint": "account@mail.com", "endpointType" : "email"}'   // TODO: tp://<hostname>/subscriptions
```

### List Subscriptions per Alert Endpoint
```
curl -i -X GET -H 'Content-Type: application/json' http://<hostname>/subscriptions/endpoint/<alert-endpoint>
```

### Signal an Event
```
curl -i -XPOST -H 'Content-Type: application/json' -d '{"eventId": "1234_NEW_CONTRIBUTION_IDEA", "title": "New IDEA in Quality of Life WG", "text" : "Notification text", "data": "Build ID: dget-2241"}' http://<hostname>/signals
```

The following APIs are intended for secondary(admin-type)scenarios like cleanup, etc.
### Delete Event
```
curl -i -X DELETE http://<hostname>/events/<event-id>
```

### Delete Subscription
```
curl -i -X DELETE http://<hostname>/subscriptions/<subscription-id>
```

### Delete Subscription using eventId and alertEndpoint
```
curl -i -X DELETE http://<hostname>/subscriptions/<event-id>/<alert-endpoint>
```

### Modify Event
```
curl -i -X PUT -H 'Content-Type: application/json' -d '{"description": "Brand new description"}' http://<hostname>/events/<event-id>
```
