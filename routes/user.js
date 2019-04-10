const express = require('express');
const router = express.Router();

const csrf = require('csurf');
const passport = require('passport');


const {
    loadSignUpPage,
    signUpUser,
    loadSignInPage,
    loginUser,
    loadProfile,
    logoutUser
} = require('../controllers/user');

const csrfProtection = csrf();
router.use(csrfProtection);

/*User Management Start*/

router.get('/signup', notLoggedIn, loadSignUpPage);
router.post('/signup', signUpUser, passport.authenticate('local', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), loginUser);

router.get('/signin', notLoggedIn, loadSignInPage);
router.post('/signin', passport.authenticate('local', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), loginUser);

router.get('/profile', isLoggedIn, loadProfile);
router.get('/logout', isLoggedIn, logoutUser);

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