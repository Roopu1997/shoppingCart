let db = require('../dbConnect');

let addItem = function (item, callback) {
    db.get().collection('item').insertOne(item, function (err) {
        if(err) {
            return callback(err);
        }
        return callback(false);
    })
};
let readItem = function (callback) {
    db.get().collection('item').find().toArray(function (err, item) {
        if(err)
        {
            return callback(err);
        }
        return callback(null, item)
    })
};

/*User.find({},{_id:0}).toArray(function (err, result) {
    if(err)
    {
        console.log('failed to read');
        process.exit(1)
    }
    buffer = result;
    console.log(result);
});*/

module.exports = {
    addItem, readItem
};