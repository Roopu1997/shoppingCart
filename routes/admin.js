const express = require('express');
const router = express.Router();

let csrf = require('csurf');

const {loadInventoryForm, addInventory} = require('../controllers/admin');


/*let csrfProtection = csrf();
router.use(csrfProtection);*/

/*Admin Routes Start*/

router.get('/additem'/*, isAdmin*/, loadInventoryForm);
router.post('/additem', addInventory);

/*Admin Routes End*/


/*Route Protection Start*/

/*router.post('/check', function (req, res, next) {
    let pass = req.body.password.toString();
    console.log(pass);
    if(pass === 'admin123') {
        req.session.admin = true;
        res.redirect('/admin/additem');
    } else {
        res.redirect('/');
    }
});

router.get('/resetadmin', function (req, res, next) {
    req.session.admin = false;
    res.redirect('/');
});

function isAdmin(req, res, next) {
    if(req.session.admin){
        next();
    } else {
        // res.window.alert('Please login:');
        res.send('<form action="/admin/check" method="post">' +
            '<input type="text" name="password">' +
            '<input type="submit">' +
            '</form>'
        );
    }
}*/

/*Route Protection End*/

module.exports = router;