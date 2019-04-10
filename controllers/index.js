const inventoryHelper = require('../dbconfig/dbHelper/inventoryHelper');
const orderHelper = require('../dbconfig/dbHelper/orderHelper');

exports.loadShop = (req, res) => {
    // max items per page
    // console.log(req.session);
    const pageLimit = 9;
    const curPage = parseInt(req.query.page) || 1;

    //reading items from db
    inventoryHelper.readItem(curPage, pageLimit, function(err, count, items) {
        /*include an error handler*/
        const messages = req.flash('info');

        //redirecting to last page if queried page doesn't have any items
        if(items.length === 0) {
            const newURL = '/?page=' + Math.ceil(count / pageLimit);
            res.redirect(newURL);
        } else {
            res.render('shop/index', {
                title: 'Welcome to My Shop',
                items: items,
                messages: messages,
                hasMessage: messages.length > 0,
                totalPage: Math.ceil(count / pageLimit),
                curPage: curPage
            });
        }
    });
};

exports.addItem = (req, res) => {
    let id = req.params.id;

    //find one item by using id
    inventoryHelper.searchItem(id, function (err, item) {
        let cart = req.session.cart;
        let Cart = {};
        let items = {};

        //if cart already exists modify items in cart otherwise create new cart
        if(cart) {
            Cart.items = cart.items;
            Cart.totalPrice = cart.totalPrice;
            Cart.totalQty = cart.totalQty;
            items = Cart.items;

            //if item already exists in cart increase price and quantity otherwise save new item
            if (items[id]) {
                items[id].qty++;
                items[id].price += parseFloat(item.iPrice)
            } else {
                items[id] = {
                    item: item,
                    qty: 1,
                    price: parseFloat(item.iPrice)
                };
            }
        } else {
            Cart.items = {};
            Cart.totalPrice = 0;
            Cart.totalQty = 0;
            items[id] = {
                item: item,
                qty: 1,
                price: parseFloat(item.iPrice)
            };
        }
        Cart.items = items;
        Cart.totalQty++;
        Cart.totalPrice += parseFloat(item.iPrice);
        /*check Cart and req.session.cart value before copying Cart value to req.session.cart*/
        req.session.cart = Cart;
        req.flash('info','Item added to Cart!');
        res.redirect('/');
    });
};

exports.loadCart = (req, res) => {
    res.render('shop/cart', { title: 'Shopping Cart' });
};

exports.reduceItem = (req, res) => {
    let id = req.params.id;
    let Cart = req.session.cart;
    Cart.items[id].qty--;
    Cart.items[id].price -= parseFloat(Cart.items[id].item.iPrice);
    req.session.cart.totalQty--;
    req.session.cart.totalPrice -= parseFloat(Cart.items[id].item.iPrice);

    //deleting cart / item if the quantity becomes 0
    if(Cart.totalQty === 0) {
        delete req.session.cart;
    }
    else if(Cart.items[id].qty === 0) {
        delete Cart.items[id];
    }
    res.redirect('/cart');
};

exports.removeItem = (req, res) => {
    let id = req.params.id;
    let Cart = req.session.cart;
    req.session.cart.totalQty -= Cart.items[id].qty;
    req.session.cart.totalPrice -= Cart.items[id].price;

    //deleting cart if there are no items otherwise just delete the  item that is to be removed
    if(Cart.totalQty === 0) {
        delete req.session.cart;
    }
    else {
        delete Cart.items[id];
    }
    res.redirect('/cart');
};

exports.loadCheckoutPage = (req, res) => {
    let messages = req.flash('error');

    //redirecting to store page if no cart in session
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
};

//Payment implemented using stripe
exports.makePayment = (req, res) => {
    const stripe = require("stripe")("sk_test_xGsPPY56NvVFxpUstNeyfS51");
    let Cart = req.session.cart;

    // Get the payment token ID submitted by the form:
    const token = req.body.stripeToken;

    //making charge by using stripe token generated from client side
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

        //storing order details in database
        let Cart = req.session.cart;
        let order = {
            user: req.shop,
            cart: Cart,
            name: req.body.cName,
            address: req.body.address,
            paymentId: charge.id
        };

        //function for inserting an order document to database
        orderHelper.newOrder(order, function (err) {
            /*include error handling*/
            //delete session cart after the order is placed successfully
            delete req.session.cart;
            req.flash('info','Order Placed successfully');
            res.redirect('/');
        })
    });
};