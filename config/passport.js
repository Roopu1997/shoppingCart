let passport = require('passport');
let db = require('../dbconfig/dbConnect');
let LocalStrategy = require('passport-local').Strategy;

let registerHelper = require('../dbconfig/dbHelper/registerHelper');

passport.serializeUser(function(user, done) {
    // console.log("serialize");
    // console.log(user.email);
    done(null, user.email);
});

passport.deserializeUser(function(email, done) {
    // console.log("deserialize");
    // console.log(email);
    let User = db.get().collection('user');
    User.findOne({email: email}, function (err, user) {
        // console.log(user);
        done(err, user);
    });
});

/*passport.serializeUser(function(user, done) {
    // console.log("serialize");
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    // console.log("deserialize");
    done(null, user);
});*/

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
        let User = db.get().collection('user');
        //input validation
        req.checkBody('email', 'Invalid Email').isEmail();
        req.checkBody('password', 'Invalid Password - minimum 5 character').isLength({min: 5});
        let errors = req.validationErrors();
        if(errors) {
            let messages = [];
            errors.forEach(function (err) {
                messages.push(err.msg);
            });
            return done(null, false, req.flash('error', messages));
        }
        registerHelper.encryptPassword(password, function (err, hashPass) {
            User.findOne({ email: email }, function (err, user) {
                if (err) { return done(err); }
                if (user) { return done(null, false, {message: 'Email already in use!'}); }
                //use for passing with register user
                let newUser = {
                    email: email,
                    password: hashPass
                };
                registerHelper.registerUser(newUser, function (err) {
                    if(err) {
                        console.log("Error adding user");
                        return done(err);
                    }
                    console.log("User added");
                    return done(null, newUser);
                });
            });

        });
    }
));

passport.use('local-signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        let User = db.get().collection('user');
        //input validation
        req.checkBody('email', 'Invalid Email').isEmail();
        req.checkBody('password', 'Invalid Password - minimum 5 character').isLength({min: 5});
        let errors = req.validationErrors();
        if(errors) {
            let messages = [];
            errors.forEach(function (err) {
                messages.push(err.msg);
            });
            return done(null, false, req.flash('error', messages));
        }
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, {message: 'No User Found!'}); }
            registerHelper.validatePassword(password, user.password, function (err, result) {
                if(!result) {
                    return done(null, false, {message: 'Wrong Password!'});
                }
                return done(null, user);
            });
        });
    }
));