let db = require('../dbConnect');

let registerUser = function (email, password, callback) {
  db.get().collection('user').insertOne({
      email: email,
      password: password
  }, function (err) {
        if(err) {
            callback(false);
        }else{
            callback(true);
        }
    })
};
let showcol = () => {
    const col = db.get().collection('user');
    console.log(col.find());
};
module.exports = {
    registerUser, showcol
};