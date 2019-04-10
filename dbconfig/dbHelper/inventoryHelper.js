let db = require('../dbConnect');
let ObjectID = require('mongodb').ObjectID;

let addItem = function (item, callback) {
    db.get().collection('item').insertOne(item, function (err) {
        if(err) {
            return callback(err);
        }
        return callback(false);
    })
};

//method to read set number of items for each page in shop
let readItem = function (curPage, pageLimit, callback) {
    //skipping items depending on current page and reading a set number of items from db
    db.get().collection('item')
        .find()
        .skip((curPage - 1) * pageLimit)
        .limit(pageLimit)
        .toArray(function (err, item) {
        if(err)
        {
            return callback(err);
        }
        //counting total number of items in db to calculate the total page required
        db.get().collection('item').countDocuments(function (err, count) {
            return callback(null, count, item)
        })
    })
};

//finding an item by using id
let searchItem = function (id, callback) {
    let objectid = new ObjectID(id);
    db.get().collection('item').findOne({ _id: objectid }, function (err, item) {
        if(err)
        {
            return callback(err);
        }
        //console.log(item);
        return callback(null, item);
    });
};

module.exports = {
    addItem, readItem, searchItem
};