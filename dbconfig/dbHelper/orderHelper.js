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

module.exports = {
    newOrder, getOrders
};
