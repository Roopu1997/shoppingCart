let db = require('../dbConnect');

let registerUser = function (email, password, callback) {
  db.get().collection('user').insertOne({
      email: email,
      password: password
  }, function (err) {
        if(err) {
            return callback(err);
        }
        return callback(false);
    })
};

module.exports = {
    registerUser
};