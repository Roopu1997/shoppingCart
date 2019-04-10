const express = require('express');
const router = express.Router();

const csrf = require('csurf');

const {
  loadShop,
  addItem,
  loadCart,
  reduceItem,
  removeItem,
  loadCheckoutPage,
  makePayment
} = require('../controllers/index');

const csrfProtection = csrf();
router.use(csrfProtection);

/*Shopping routes start*/

router.get('/', loadShop);
router.get('/addtocart/:id', addItem);
router.get('/cart', loadCart);
router.get('/reduceitem/:id', reduceItem);
router.get('/removeitem/:id', removeItem);
router.get('/checkout', isLoggedIn, loadCheckoutPage);
router.post('/checkout', makePayment);

/*Shopping routes end*/


/*Route Protection Start*/

//middleware to force login user when trying to checkout
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please login before checking out!');
  //storing url to session to redirect user back to checkout page after signing in
  req.session.oldURL = req.url;
  res.redirect('/user/signin');
}

/*Route Protection End*/

module.exports = router;