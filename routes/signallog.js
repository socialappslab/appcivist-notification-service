exports.findRecent = function(req, res) {

    db = req.app.get('db');
    var collection = db.collection('signalLog');
    collection.find().sort({
        _id: -1
    }).limit(5).toArray((err, items) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(items);
        }
    });
}
