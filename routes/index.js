var express = require('express');
var router = express.Router();

let csrf = require('csurf');
let passport = require('passport');

let inventoryHelper = require('../dbconfig/dbHelper/inventoryHelper');

let csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  inventoryHelper.readItem(function(err, items) {
    res.render('index', { title: 'Welcome to My Shop', items: items });
  });
});

/*User Management Start*/
/*sign up page*/
router.get('/signup', notLoggedIn, function(req, res, next) {
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

/*sign in page*/
router.get('/signin', notLoggedIn, function(req, res, next) {
  let messages = req.flash('error');
  res.render('user/signin', { title: 'Sign in to your Account', csrfToken: req.csrfToken, message: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));

/*profile route*/
router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('user/profile', { title: 'User Profile' });
});

router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
});
/*User Management End*/

/*Admin Routes Start*/
/*Adding items to inventory*/
router.get('/additem', function (req, res, next) {
  let messages = req.flash('info');
  res.render('admin/additem', {title: 'Add Items to Inventory', csrfToken: req.csrfToken, message: messages, hasMessage: messages.length > 0});
});

router.post('/additem', function (req, res, next) {
  let item = {
    iName: req.body.iName,
    iDesc: req.body.iDesc,
    iPrice: req.body.iPrice,
    iImg: req.body.iImg
  };
  inventoryHelper.addItem(item, (err) => {
    if(err) {
      console.log(err);
    }else{
      console.log("Item Added Successfully");
      req.flash('info', 'Item added Successfully');
    }
    res.redirect('/additem');
  });
});

/*Admin Routes End*/

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