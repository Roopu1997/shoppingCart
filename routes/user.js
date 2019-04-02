var express = require('express');
var router = express.Router();

let csrf = require('csurf');
let passport = require('passport');

let orderHelper = require('../dbconfig/dbHelper/orderHelper');

let csrfProtection = csrf();
router.use(csrfProtection);

/*User Management Start*/

/*sign up page*/
router.get('/signup', notLoggedIn, function(req, res, next) {
    let messages = req.flash('error');
    res.render('user/signup', {
        title: 'Create an Account',
        csrfToken: req.csrfToken,
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/signup', passport.authenticate('local-signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res) {

    let oldURL = req.session.oldURL;

    // console.log(oldURL);
    if (oldURL) {
        req.session.oldURL = null;
        res.redirect(oldURL);
    } else {
        res.redirect('/user/profile')
    }
});

/*sign in page*/
router.get('/signin', notLoggedIn, function(req, res, next) {
    let messages = req.flash('error');
    // console.log(req.session);
    res.render('user/signin', {
        title: 'Sign in to your Account',
        csrfToken: req.csrfToken,
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/signin', passport.authenticate('local-signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res) {

    let oldURL = req.session.oldURL;

    // console.log(oldURL);
    if (oldURL) {
        req.session.oldURL = null;
        res.redirect(oldURL);
    } else {
        res.redirect('/user/profile')
    }
});

/*profile route*/
router.get('/profile', isLoggedIn, function(req, res, next) {
    // console.log(req.session);
    // console.log(req.user);
    orderHelper.getOrders(req.user, function (err, orders) {
        // console.log(orders);
        res.render('user/profile', { title: 'User Profile', orders: orders, user: req.user.email});
    });
});

router.get('/logout', isLoggedIn, function(req, res, next) {
    req.logout();
    // req.session.destroy(function (err) {
    res.redirect('/');
    // });
});

/*User Management End*/

/*Route Protections Start*/
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
/*Route Protections End*/

module.exports = router;