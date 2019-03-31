var express = require('express');
var router = express.Router();

let csrf = require('csurf');
let passport = require('passport');

let inventoryHelper = require('../dbconfig/dbHelper/inventoryHelper');

let csrfProtection = csrf();
router.use(csrfProtection);

/*Shop routes start*/
/* GET home page. */
router.get('/', function(req, res, next) {
  inventoryHelper.readItem(function(err, items) {
    let messages = req.flash('info');
    // console.log(req.session);
    console.log(req.session.cart);
    res.render('index', { title: 'Welcome to My Shop', items: items, messages: messages, hasMessage: messages.length > 0 });
  });
});
let c = 1;
//add to cart
router.get('/addtocart/:iName', function (req, res, next) {
  // console.log(req.params.iName);
  let iName = req.params.iName;
  //checking method to check whether cart already have a certain item
  /*if(req.session.cart) {
    let Cart = req.session.cart;
    // console.log(Cart.items);
    // console.log(Cart);
    // console.log(Cart.items.item);
    /!*if(Cart.items.some(items => items.item.iName === iName)) {
      console.log(c++ + ": true");
    }*!/
    Cart.items.forEach(function (items) {
      console.log(items[iName]);
      if(items.item.iName === iName) {
        // console.log(c++ + ": true");
        items.qty++;
        items.price += parseFloat(items.item.iPrice);
        // res.redirect('/');
      }
    })
  }*/
  inventoryHelper.searchItem(iName, function (err, item) {
    // console.log(item);
    // console.log('cart');
    /*if(req.session.cart) {
      //push to existing cart if cart already created
      let items = {
        item: item,
        qty: 1,
        price: parseFloat(item.iPrice)
      };
      let Cart = req.session.cart;
      Cart.items.push(items);
      Cart.totalQty++;
      Cart.totalPrice += parseInt(item.iPrice);
    } else {
      //create new cart if adding to cart first time
      //create a new item in cart
      let items = {
        item: item,
        qty: 1,
        price: parseFloat(item.iPrice)
      };
      //create new cart
      /!*let cart = [];
      cart.push(item);*!/
      //add Cart to session
      req.session.cart = {
        items: {
          iName: item.iName,
          item: item,
          qty: 1,
          price: item.iPrice
        },
        totalQty: 1,
        totalPrice: item.iPrice
      };
    }*/
    if(req.session.cart){
      console.log(req.session.cart)
    }
    let cart = req.session.cart;
    let Cart = {};
    let items = {};
    if(cart) {
      Cart.items = cart.items;
      Cart.totalPrice = cart.totalPrice;
      Cart.totalQty = cart.totalQty;
      items = Cart.items;
      if (items[iName]) {
        items[iName].qty++;
        items[iName].price += parseFloat(item.iPrice)
      } else {
        items[iName] = {
          item: item,
          qty: 1,
          price: parseFloat(item.iPrice)
        };
      }
    } else {
      Cart.items = {};
      Cart.totalPrice = 0;
      Cart.totalQty = 0;
      items[iName] = {
        item: item,
        qty: 1,
        price: parseFloat(item.iPrice)
      };
    }
    Cart.items = items;
    Cart.totalQty++;
    Cart.totalPrice += parseFloat(item.iPrice);
    req.session.cart = Cart;
    /*let items = {};
    items[iName] = {
      item: item,
      qty: 1,
      price: item.iPrice
    };
    let Cart = {
      items: {},
      totalQty: 1,
      totalPrice: item.iPrice
    };
    Cart.items = items;
    req.session.cart = Cart;*/
    req.flash('info','Item added to Cart!');
    res.redirect('/');
  });
});

/*Shop routes start*/

/*User Management Start*/
/*sign up page*/
router.get('/signup', notLoggedIn, function(req, res, next) {
  let messages = req.flash('error');
  res.render('user/signup', { title: 'Create an Account', csrfToken: req.csrfToken, messages: messages, hasErrors: messages.length > 0});
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
  // console.log(req.session);
  res.render('user/signin', { title: 'Sign in to your Account', csrfToken: req.csrfToken, messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));

/*profile route*/
router.get('/profile', isLoggedIn, function(req, res, next) {
  // console.log(req.session);
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