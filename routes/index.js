var express = require('express');
var router = express.Router();

let csrf = require('csurf');

let inventoryHelper = require('../dbconfig/dbHelper/inventoryHelper');
let orderHelper = require('../dbconfig/dbHelper/orderHelper');

let csrfProtection = csrf();
router.use(csrfProtection);

/*Shop routes start*/
/* GET home page. */
router.get('/', function(req, res, next) {
  inventoryHelper.readItem(function(err, items) {
    let messages = req.flash('info');
    // console.log(req.session);
    // console.log(req.session.cart);
    res.render('shop/index', {
      title: 'Welcome to My Shop',
      items: items,
      messages: messages,
      hasMessage: messages.length > 0
    });
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
    /*if(req.session.cart){
      console.log(req.session.cart)
    }*/
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

router.get('/cart', function(req, res, next) {
  inventoryHelper.readItem(function(err, items) {
    // let messages = req.flash('info');
    // console.log(req.session);
    // console.log(req.session.cart);
    res.render('shop/cart', { title: 'Shopping Cart' });
  });
});

//reduce cart item
router.get('/reduceitem/:iName', function(req, res, next) {
  let iName = req.params.iName;
  // console.log(iName);
  let Cart = req.session.cart;
  Cart.items[iName].qty--;
  Cart.items[iName].price -= parseFloat(Cart.items[iName].item.iPrice);
  req.session.cart.totalQty--;
  req.session.cart.totalPrice -= parseFloat(Cart.items[iName].item.iPrice);
  if(Cart.totalQty === 0) {
    delete req.session.cart;
  }
  else if(Cart.items[iName].qty === 0) {
    delete Cart.items[iName];
  }
  res.redirect('/cart');
});

//remove cart item
router.get('/removeitem/:iName', function(req, res, next) {
  let iName = req.params.iName;
  // console.log(iName);
  let Cart = req.session.cart;
  req.session.cart.totalQty -= Cart.items[iName].qty;
  req.session.cart.totalPrice -= Cart.items[iName].price;
  if(Cart.totalQty === 0) {
    delete req.session.cart;
  }
  else {
    delete Cart.items[iName];
  }
  res.redirect('/cart');
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
  let messages = req.flash('error');
  if(req.session.cart) {
    res.render('shop/checkout', {
      title: 'Make Payment',
      csrfToken: req.csrfToken,
      messages: messages,
      hasErrors: messages.length > 0
    });
  } else {
    res.redirect('/');
  }
});

router.post('/checkout', function(req, res, next) {
  // console.log(req.body.stripeToken);

  var stripe = require("stripe")("sk_test_xGsPPY56NvVFxpUstNeyfS51");
  let Cart = req.session.cart;

  // Token is created using Checkout or Elements!
  // Get the payment token ID submitted by the form:
  const token = req.body.stripeToken; // Using Express

  stripe.charges.create({
    amount: Cart.totalPrice * 100,
    currency: 'usd',
    description: 'My Shop test1',
    source: token,
  }, function (err, charge) {
    if(err) {
      req.flash('error', err.message);
      res.redirect('/checkout');
    }
    // console.log({charge});
    let Cart = req.session.cart;
    let order = {
      user: req.user,
      cart: Cart,
      name: req.body.cName,
      address: req.body.address,
      paymentId: charge.id
    };
    // console.log(order);
    orderHelper.newOrder(order, function (err) {
      delete req.session.cart;
      req.flash('info','Order Placed successfully');
      res.redirect('/');
    })
  });
});

/*Shop routes end*/


/*Admin Routes Start*/
/*Adding items to inventory*/
router.get('/additem', function (req, res, next) {
  let messages = req.flash('info');
  res.render('admin/additem', {
    title: 'Add Items to Inventory',
    csrfToken: req.csrfToken,
    message: messages,
    hasMessage: messages.length > 0
  });
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

/*Route Protection Start*/

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  req.session.oldURL = req.url;
  // console.log(req.session.oldURL);
  res.redirect('/user/signin');
}

/*Route Protection End*/

module.exports = router;