var express     = require('express');
var router      = express.Router();
var db          = require('../db');
var errors      = require('../utils/errors.js');
var Q           = require('q');
var logic       = require('../logic.js');


//Home
router.route('/')
    .get(getHomeHandler)

router.route('/appdata/get')
    .get(getAppData)

router.route('/appdata/set')
    .post(setAppData)

router.route('/supplierdata/get/weekly')
    .get(printAllWeeklyData)

router.route('/appdata/set/item')
    .post(setItemData)

router.route('/appdata/set/toggleitem')
    .post(toggleItem)


router.route('/appdata/get/allweekly')
    .get(printAllWeeklyData)

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

function printAllWeeklyData(req, res){
    res.setHeader('Content-Type', 'application/json');
    Q.fcall(db.getSuppliersList)
	.then(function(suppliers){
	    return logic.createSuppliersInventoryFolder(suppliers)
	})
	.then(function(path){
	    return logic.makePhotosZip(path);
	})
	.then(function(zipPath){ 
	    if(zipPath)
		res.json({success: true, path: zipPath});
	    else
		res.json({success: false, error: "No Data"});
	})
	.catch(function(err){
	    res.json({success: false, error: err});
	});
}
  
function getSupplierDataWeekly(req, res){
    res.setHeader('Content-Type', 'application/json');
    var supplier = req.query.supplier;
    db.getWeeklySupplierData(supplier, (err, docs) =>{
	if(err) res.json({success: false, error: errors.unableToLoadData});
	else    res.json({success: true, data: docs});
    });
}

function setItemData(req, res){
    if(req.body.id)
	db.updateInventory(req.body.id, req.body.name, req.body.value, "inventory");
    res.send({ success: true, redirect: 0});
}


function toggleItem(req, res){
    db.updateInventory(req.body.id, "foundP", req.body.status, "inventory");
    res.send({success: true, redirect: 0});
}
    
//------------------------------ END OF ROUTES ----------------
module.exports = router;
