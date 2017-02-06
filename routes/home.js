var express     = require('express');
var router      = express.Router();
var db          = require('../db');
//Home
router.route('/')
    .get(getHomeHandler)

router.route('/appdata')
    .get(getAppData)
    .post(postAppData)


function getHomeHandler(req, res){
    res.render('home', {});
}

function getAppData(req, res){
    res.setHeader('Content-Type', 'application/json');
    var templateVariables = {inventory: [], suppliers: [], error: null}
    var inventory = db.getInventory(function(err, inventoryDocs){
	if(err) templateVariables.error = err;
	else templateVariables.inventory = inventoryDocs;
	var suppliers = db.getSuppliers(function(err, inventorySuppliers){
	    if(err) templateVariables.error = err;
	    else templateVariables.suppliers = inventorySuppliers;
	    res.json({success: true, data: templateVariables});
	});
    });
}


function postAppData(req, res){
    console.log("posted");
    console.log(JSON.stringify(req.body));
    res.send({ success: true, redirect: 0})
}

//------------------------------ END OF ROUTES ----------------
module.exports = router;
