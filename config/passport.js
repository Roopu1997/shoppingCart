let passport = require('passport');
let db = require('../dbconfig/dbConnect');
let LocalStrategy = require('passport-local').Strategy;

let registerHelper = require('../dbconfig/dbHelper/registerHelper');

/*passport.serializeUser((user, done) => {
    console.log("serialize");
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log("deserialize");
    let User = db.get().collection('user');
    User.find({_id: id}, (err, user) => {
        done(err, user);
    });
});*/

passport.serializeUser(function(user, done) {
    console.log("serialize");
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log("deserialize");
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
        console.log("local");
        let User = db.get().collection('user');
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (user) { return done(null, false, {message: 'Email already in use.'}); }
            console.log('localfind');
            //use for passing with register user
            let newUser = {
                email: email,
                password: password
            };
            registerHelper.registerUser(email, password, function (err) {
                if(err) {
                    console.log("Error adding user");
                    return done(err);
                }
                console.log("User added");
                return done(null, newUser);
            });
        });
    }
));