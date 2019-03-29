var express = require('express');
var router = express.Router();

let csrf = require('csurf');

let registerHelper = require('../dbconfig/dbHelper/registerHelper');

let csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Shop' });
});

/*sign up page*/
router.get('/signup', function(req, res, next) {
  res.render('user/signup', { title: 'Create an Account', csrfToken: req.csrfToken });
});

router.post('/signup', function (req, res) {

  let email = req.body.email;
  let password = req.body.password;

  console.log(email, password);

  registerHelper.registerUser(email, password, function (status) {
    if(status) {
      console.log("User added");
      registerHelper.showcol();
      res.redirect('/');
    }else{
      console.log("Error adding user");
      res.redirect('/signup');
    }
  });
});

module.exports = router;
