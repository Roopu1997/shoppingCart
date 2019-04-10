let db = require('../dbConnect');
let bcrypt = require('bcrypt');
const saltRounds = 10;

const registerUser = async ({name, email, password}) => {
    const User = db.get().collection('user');
    try {
        const user = await User.findOne({email: email});
        if(user) {
            return "Email already exists";
        }
        const hash = bcrypt.hashSync(password, saltRounds);
        const newUser = {name, email, hash};
        await User.insertOne(newUser);
        return null;
    } catch (err) {
        if(err) {
            return console.log(err);
        }
    }

};

const getUserByID = (id, done) => {
    let User = db.get().collection('user');
    User.findOne({_id: id}, function (err, user) {
        done(err, user);
    });
};

const validatePass = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

const authenticateUser = async (email, password, done) => {
    const User = db.get().collection('user');
    try {
        const user = await User.findOne({email});
        if(!user) return done(null, false, {message: "No user found!"});
        if(!validatePass(password, user.hash)) return done(null, false, {message: "Wrong Password!"});
        return done(null, user);
    } catch(err) {
        done(err);
    }
};

module.exports = {
    registerUser, getUserByID, authenticateUser
};