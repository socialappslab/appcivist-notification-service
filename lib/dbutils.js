var mongo = require('mongodb');
var mongoUri = 'mongodb://localhost:27017/notificationservice';

console.log('mongoUri: ', mongoUri); 

exports.mongoUri = mongoUri;
exports.BSON = mongo.BSONPure;

exports.cleardb = function(doneit) {
	
   console.log('Clearing Database'); 

   mongo.Db.connect(mongoUri, function (err, db) {
     if (err) {return console.dir(err);}

     db.collection('signalLog', function(err, collection) {
       if (err) {return console.dir(err);}
       collection.remove({},{w:1}, function(err, result) {
         if (err) {return console.dir(err);}
         db.collection('events', function(err, collection) {
	       if (err) {return console.dir(err);}
           collection.remove({},{w:1}, function(err, result) {
             if (err) {return console.dir(err);}
             db.collection('subscriptions', function(er, collection) {
		       if (err) {return console.dir(err);}
		       collection.remove({},{w:1}, function(err, result) {
		          if (err) {return console.dir(err);}
		          console.log('Event and Subscription and SignalLog documents deleted');
		          db.close();
                  console.log('Database cleared');
		          doneit();
		       }); 
		     }); 
	       });    
         });
	   });
     });
   });

}
