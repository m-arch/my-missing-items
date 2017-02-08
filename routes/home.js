var express     = require('express');
var router      = express.Router();
var db          = require('../db');
var errors      = require('../utils/errors.js');

//Home
router.route('/')
    .get(getHomeHandler)

router.route('/appdata/get')
    .get(getAppData)

router.route('/appdata/set')
    .post(setAppData)

router.route('/supplierdata/get/weekly')
    .get(getSupplierDataWeekly)

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


function setAppData(req, res){
    if(req.body.inventory)
       db.save(req.body.inventory, "inventory");
    if(req.body.suppliers)
	db.save(req.body.suppliers, "suppliers");
    res.send({ success: true, redirect: 0});
}

function getSupplierDataWeekly(req, res){
    res.setHeader('Content-Type', 'application/json');
    var supplier = req.query.supplier;
    db.getWeeklySupplierData(supplier, (err, docs) =>{
	if(err) res.json({success: false, error: errors.unableToLoadData});
	else    res.json({success: true, data: docs});
    });
}
	
    
//------------------------------ END OF ROUTES ----------------
module.exports = router;
