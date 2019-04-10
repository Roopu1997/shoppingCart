const inventoryHelper = require('../dbconfig/dbHelper/inventoryHelper');

exports.loadInventoryForm = (req, res) => {
    let messages = req.flash('info');
    res.render('admin/additem', {
        title: 'Add Items to Inventory',
        /*csrfToken: req.csrfToken,*/
        message: messages,
        hasMessage: messages.length > 0
    });
};

exports.addInventory = (req, res) => {
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
        res.redirect('/admin/additem');
    });
};