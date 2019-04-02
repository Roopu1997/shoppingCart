let db = require('../dbConnect');

let newOrder = function (order, callback) {
    db.get().collection('order').insertOne(order, function (err) {
        if(err) {
            return callback(err);
        }
        return callback(false);
    })
};

let getOrders = function (user, callback) {
    db.get().collection('order').find({user: user}).toArray(function (err, item) {
        if(err)
        {
            return callback(err);
        }
        return callback(null, item)
    })
};

/*
let readItem = function (callback) {
    db.get().collection('item').find().toArray(function (err, item) {
        if(err)
        {
            return callback(err);
        }
        return callback(null, item)
    })
};

let searchItem = function (name, callback) {
    // var idHex = new db.get().ObjectId.constructor(id);
    // console.log(idHex);
    db.get().collection('item').findOne({ iName: name }, function (err, item) {
        if(err)
        {
            return callback(err);
        }
        // console.log(item);
        return callback(null, item);
    });
};

/!*User.find({},{_id:0}).toArray(function (err, result) {
    if(err)
    {
        console.log('failed to read');
        process.exit(1)
    }
    buffer = result;
    console.log(result);
});*!/
*/

module.exports = {
    newOrder, getOrders
};
