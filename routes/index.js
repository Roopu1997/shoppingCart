var express = require('express');
var router = express.Router();

let csrf = require('csurf');
let passport = require('passport');

let registerHelper = require('../dbconfig/dbHelper/registerHelper');

let csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to My Shop' });
});

/*sign up page*/
router.get('/signup', function(req, res, next) {
  let messages = req.flash('error');
  res.render('user/signup', { title: 'Create an Account', csrfToken: req.csrfToken, message: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
})/*, function (req, res) {

  let email = req.body.email;
  let password = req.body.password;

  console.log(email, password);
  res.redirect('/');

  /!*registerHelper.registerUser(email, password, function (status) {
    if(status) {
      console.log("User added");
      res.redirect('/');
    }else{
      console.log("Error adding user");
      res.redirect('/signup');
    }
  });*!/
}*/);

/*profile route*/
router.get('/profile', function(req, res, next) {
  res.render('user/profile', { title: 'User Profile' });
});

module.exports = router;
