var Q = require('q');

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
	    return done(null, docs.reverse());
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


exports.getSuppliersList = function(done){
    var def = Q.defer();
    var list = [];
    state.db.collection("suppliers").find({}, {_id: -1, name: 1}).toArray(function(err, docs){
	if(err){
	    console.log(err);
	    def.reject(err);
	}else{
	    docs.map(function(doc, i){
		list.push(doc.name);
		if(i == docs.length - 1){
		    def.resolve(list);
		}
	    });
	}
    });
    return def.promise;
}

					 

exports.save = function(data, collection){
    if(data)
	state.db.collection(collection).update({_id: data._id}, data, {upsert: true});
}


exports.getWeeklySupplierData = function(supplier, done, reduceDateP){
    state.db.collection("inventory").find({supplier: supplier, foundP: {$ne: "true"} }).toArray(function(err, docs){
	if(err){
	    console.log(err)
	    return done(err);
	}else{
	    if(reduceDateP){
		docs.map(function(doc, i){
		    doc.savedOn = doc.savedOn.substring(0,15);
		    if(i + 1 == docs.length){
			return done(null, docs);
		    }
		});
	    }else{
		return done(null, docs);
	    }
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
    case "foundP":
	toSet = {foundP: value};
	break;
    default:
	toSet = {supplier: value};
    }
    state.db.collection(collection).update({_id: id}, {$set: toSet});
}
