const orderHelper = require('../dbconfig/dbHelper/orderHelper');
const {registerUser} = require('../dbconfig/dbHelper/registerHelper');

exports.loadSignUpPage = (req, res) => {
    let messages = req.flash('error');
    res.render('user/signup', {
        title: 'Create an Account',
        csrfToken: req.csrfToken,
        messages: messages,
        hasErrors: messages.length > 0
    });
};

exports.signUpUser = (req, res, next) => {
    //validation
    req.checkBody('name', 'Name Required').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('password', 'Invalid Password - minimum 5 character').isLength({min: 5});
    let errors = req.validationErrors();
    if(errors) {
        let messages = [];
        errors.forEach(function (err) {
            messages.push(err.msg);
        });
        req.flash('error', messages);
        return res.redirect('/user/signup');
    }
    registerUser(req.body)
        .then(result => {
            if(result) {
                req.flash('error', result);
                res.redirect('/user/signup');
            } else {
                console.log('User added successfully');
                next();
                // res.redirect('/user/profile');
            }
        });
};

exports.loadSignInPage = (req, res) => {
    let messages = req.flash('error');
    res.render('user/signin', {
        title: 'Sign in to your Account',
        csrfToken: req.csrfToken,
        messages: messages,
        hasErrors: messages.length > 0
    });
};

exports.loginUser = (req, res) => {
    let oldURL = req.session.oldURL;
    if (oldURL) {
        req.session.oldURL = null;
        res.redirect(oldURL);
    } else {
        res.redirect('/user/profile')
    }
};

exports.loadProfile = (req, res) => {
    orderHelper.getOrders(req.user, function (err, orders) {
        // console.log(orders);
        // console.log(req.session);
        // console.log(req.user);
        res.render('user/profile', { title: 'Profile', orders: orders, user: req.user.name});
    });
};

exports.logoutUser = (req, res) => {
    req.logout();
    /*save and destroy cart on logout*/
    // req.session.destroy(function (err) {
    res.redirect('/');
    // });
};