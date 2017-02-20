//MongoDB client 
var MongoClient = require('mongodb').MongoClient
  , async = require('async')


//Setting up the mongo database
var state = {
    db: null,
    mode: null,
}

exports.connect = function(mode, done) {
    if (state.db) return done()
    
    var uri = null;
    switch(mode) {
    case process.env.DEV_ENV:
	uri = process.env.DEV_DB_URL;
	break;
    default:
	uri = process.env.PROD_DB_URL;
    }
    
    MongoClient.connect(uri, function(err, DB) {
	if (err){ 
	    console.log("error: " + err);
	    done(err);
	}else{
	    console.log("connected correctly to server db");
	    state.db = DB;
	    state.mode = mode;
	    initCollections();
	    done();
	}
    });
}
 
//-------------------------------------Creating collections------------//

COLLECTIONS = ["suppliers", "inventory"]

var initCollections = function(){
    COLLECTIONS.forEach(function(coll){
	state.db.createCollection(coll, function(err, collection){
	    if(err) console.log(err)
	    else console.log("successfully created collection: " + coll);
	});
    });
}


//------------------------------Database management operations----------------------------//

exports.getInventory = function(done){
    state.db.collection("inventory").find().toArray(function(err, docs){
	if(err){
	    console.log(err);
	    return done(err);
	}else{
	    return done(null, docs);
	}
    });
}

exports.getSuppliers = function(done){
    state.db.collection("suppliers").find().toArray(function(err, docs){
	if(err){
	    console.log(err);
	    return done(err);
	}else{
	    return done(null, docs);
	}
    });
}
					 

exports.save = function(data, collection){
    if(data)
	state.db.collection(collection).update({_id: data._id}, data, {upsert: true});
}


exports.getWeeklySupplierData = function(supplier, done){
    state.db.collection("inventory").find({supplier: supplier}).toArray(function(err, docs){
	if(err){
	    console.log(err)
	    return done(err);
	}else{
	    return done(null, docs);
	}
    });
}

exports.updateInventory = function(id, field, value, collection){
    var toSet = null;
    switch(field){
    case "code":
	toSet = {code: value};
	break;
    case "description":
	toSet = {description: value};
	break;
    case "quantity":
	toSet = {quantity: value};
	break;
    default:
	toSet = {supplier: value};
    }
    state.db.collection(collection).update({_id: id}, {$set: toSet});
}
