const passport = require('passport');
const ObjectID = require('mongodb').ObjectID;
const LocalStrategy = require('passport-local').Strategy;

const {getUserByID, authenticateUser} = require('../dbconfig/dbHelper/registerHelper');

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    let objectId = new ObjectID(id);
    getUserByID(objectId, done);
});

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, authenticateUser));
