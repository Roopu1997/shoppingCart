const mongodb = require('mongodb').MongoClient;

let state = {
    db: null
};

let connect = function(done) {
    let url = 'mongodb://localhost:27017';

    mongodb.connect(url, function (err, db) {
        if(err)
            return done(err);

        state.db = db.db('shop');
        done();
    })
};

let get = function () {
    return state.db;
};

module.exports = {
    connect,get
};