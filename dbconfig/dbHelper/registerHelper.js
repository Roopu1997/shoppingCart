let db = require('../dbConnect');
let bcrypt = require('bcrypt');
const saltRounds = 10;

let registerUser = function (user, callback) {
  db.get().collection('user').insertOne(user, function (err) {
        if(err) {
            return callback(err);
        }
        return callback(false);
    })
};

//encrypt password
let encryptPassword = function (password, register) {
    bcrypt.hash(password, saltRounds, register);
};

//validate password
let validatePassword = function (password, hashPass, callback) {
    bcrypt.compare(password, hashPass, callback);
};

module.exports = {
    registerUser, encryptPassword, validatePassword
};