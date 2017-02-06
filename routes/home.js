var express     = require('express');
var router      = express.Router();
var db          = require('../db');
//Home
router.route('/')
    .get(getHomeHandler)
    .post(postHomeHandler)


function getHomeHandler(req, res){
    var templateVariables = {inventory: [], suppliers: [], error: null}
    var inventory = db.getInventory(function(err, inventoryDocs){
	if(err) templateVariables.error = err;
	else templateVariables.inventory = inventoryDocs;
	var suppliers = db.getSuppliers(function(err, inventorySuppliers){
	    if(err) templateVariables.error = err;
	    else templateVariables.suppliers = inventorySuppliers;
	    res.render('home', templateVariables);
	});
    });
}


function postHomeHandler(req, res){
    res.send({ success: true, redirect: 0})
}

//------------------------------ END OF ROUTES ----------------
module.exports = router;
