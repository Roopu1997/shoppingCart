const mongodb = require('mongodb').MongoClient;

let state = {
    db: null
};

const connect = async () => {
    const url = 'mongodb://localhost:27017';
    try {
        const db = await mongodb.connect(url, {useNewUrlParser: true});
        state.db = db.db('shop');
        return null;
    } catch (err) {
        return err;
    }
};

const get = () => {
    return state.db;
};

module.exports = {
    connect, get
};