var Q = require('q');
var db = require('./db.js');
var express = require('express');
var exp = express();
var pug = require('pug');
var fs = require('fs');
var fse = require('fs-extra')
var zipFolder = require('zip-folder');
//for creating image from html
var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path
var _vars = require('./utils/vars.js');

//static content use
exp.use('/', express.static('public'));

exp.set('view engine', 'pug');


//this function create all html files for the suppliers' inventories.
exports.createSuppliersInventoryFolder = function(suppliers){
    var def = Q.defer();
    var folderName = Date.now();
    var path = "./public/purge/" + folderName;
    fs.mkdirSync(path);
    suppliers.map(function(supplier, i){
	db.getWeeklySupplierData(supplier, (err, items) =>{
	    if(err) def.reject(err);
	    if(items && items.length > 0){
		exp.render('weekly', {supplier: supplier, items: items }, (err, html) =>{
		    fs.writeFile(path + "/" + supplier + i + Date.now() + ".html" , html, (err) => {
			if (err) {
			    if (err.code === "EEXIST") {
				def.reject('file already exists');
				return;
			    } else {
				def.reject(err);
			    }
			}else{
			    def.resolve(path);
			}
		    });
		});
	    }
	}, true);
    });
    return def.promise;
}


//this function takes a folder path of html files and create from it a zip file with same name containing images of html pages
exports.makePhotosZip = function(path){
    var def = Q.defer();
    Q.fcall(htmlToJpg, path)
	.then(function(){
	    setTimeout(function(){
		zipFolder(path + "/", path + ".zip", function(err) {
		    console.log("zipped");
		    if(err) {
			def.reject(err)
		    } else {
			console.log(_vars.baseHtml + (path + ".zip").split("./public")[1]);
			def.resolve(_vars.baseHtml + (path + ".zip").split("./public")[1]);
		    }
		});
	    }, 100);
	})
	.catch(function(err){
	    def.reject(err);
	});
    return def.promise;
}


var htmlToJpg = function(path){
    var def = Q.defer();
    fs.readdir(path, (err, files) =>{
	files.map((file, i) =>{
	    if(file.indexOf('.html') > 0){
		var filename = file.split(".html")[0]
		var purgePath = path.split("./public")[1]
		var childArgs = [
		    './rasterize.js',
		    _vars.baseHtml + purgePath + "/" + filename + ".html",
		    path + "/" +  filename + '.jpg',
		];
		childProcess.execFile(binPath, childArgs, function(err, stdout, stderr){
		    if(err || stderr){
			if(err)
			    def.reject(err)
			def.reject(stderr);
		    }
		    fse.remove(path + "/" + file, (err) => {
		    	if (err) console.log(err)
		    if(i == files.length -1){
			def.resolve(0);
		    }
		    })
		});
	    }
	});
    });
    return def.promise;
} 

