import assign from 'object-assign';
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';
const uuidV4 = require('uuid/v4');
var _viewData = {};
var codes = [];
var descriptions = [];
var suppliers = [];
var _weeklySupplierData = []
var _newData = {};


function populateAutoCompleteArrays(data){
   data.inventory.map((item) => {
	codes.push(item.code);
	descriptions.push(item.description);
    });
    data.suppliers.map((supplier) => {
	suppliers.push(supplier.name);
    });
    setTimeout(function(){
	$("input[name='code']").autocomplete({source: codes});
	$("input[name='description']").autocomplete({source: descriptions});
	$("input[name='supplier']").autocomplete({source: suppliers});
    }, 100);
}


function addToAutoCompleteArrays(item, isSupplierOnlyP){
    if(isSupplierOnlyP){
	suppliers.push(item.name);
    }else{
	codes.push(item.code);
	descriptions.push(item.description);
    }
}

var Store = assign({}, EventEmitter.prototype, {
    /**
     * Get the entire collection of Items.
     * @return {object}
     */
    getData() {
	$.ajax({
	    url: '/appdata/get',
	    dataType: 'json',
	    cache: false,
	    success: function(response){
		if(response.success == true)
		    {
			_viewData = response.data;
			populateAutoCompleteArrays(_viewData);
			Store.emitChange();
			return  response.data;
		    }
		else
		    {
			handleResponse(response.error.code, response.error.message);		    
		    }
	    },
	    error: function(xhr, status, err){
		alert(err);
		console.error(status, err.toString());
	    }
	});
    },
    
    setSupplierWeeklyData(supplier){
	$.ajax({
	    url: '/supplierdata/get/weekly?supplier=' + supplier,
	    dataType: 'json',
	    cache: false,
	    success: function(response){
		if(response.success == true)
		    {
			_weeklySupplierData = response.data;
			Store.emitChange();
		    }
		else
		    {
			return repsonse.error;		    
		    }
	    },
	    error: function(xhr, status, err){
		console.error(status, err.toString());
	    }
	});
    },

    setData(){
	$.ajax({
	    url: '/appdata/set',
	    dataType: 'json',
	    type: 'POST',
	    data: {inventory: _newData.inventory, suppliers: _newData.suppliers},
		 success: function(response){
		if(response.success == true)
		    {
			console.log("Data saved");
		    }
		else
		    {
			handleResponse(response.error.code, response.error.message);		    
		    }
	    },

	    error: function(xhr, status, err){
		alert(err);
		console.error(status, err.toString());
	    }
	});
    },

    reloadData(){
	if(_viewData.error)
	    setTimeout(function(){
		_viewData.error = null;
	    }, 100);
	return _viewData;
    },

    getSuppliers(){
	return suppliers;
    },

    getWeeklySupplierData(){
	return _weeklySupplierData;
    },

    getError() {
	return _viewData.error;
    },

    addItem(data){
	data._id = uuidV4();
	data.savedOn = new Date();
	_newData = {inventory: data};
	_viewData.inventory.push(data);
	addToAutoCompleteArrays(data);
	Store.setData();
	Store.emitChange();
    },

    addSupplier(data){
	data._id = uuidV4();
	data.savedOn = new Date();
	_newData = {suppliers: data};
	_viewData.suppliers.push(data);
	console.log(data);
	addToAutoCompleteArrays(data, true);
	Store.setData();
	Store.emitChange();
    },

    supplierExistsP(name, done){
	if(_viewData.suppliers && _viewData.suppliers.length >0){
	    _viewData.suppliers.map((supplier, i) => {
		if(supplier.name == name)
		    return done(true);
		else if(suppliers.length == i +1)
		    return done(false);
	    });
	}else{
	    return done(false);
	}
    },

    emitChange() {
	this.emit(CHANGE_EVENT);
	setTimeout(function(){
	    $("input[name='code']").autocomplete({source: codes});
	    $("input[name='description']").autocomplete({source: descriptions});
	    $("input[name='supplier']").autocomplete({source: suppliers});
	}, 100);
    },

    /**
     * @param {function} callback
     */
    addChangeListener(callback) {
	this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener(callback) {
	this.removeListener(CHANGE_EVENT, callback);
    },


    /**
    * @param {string} key that is being edited
    * @param {string} value inputed by user
    */
    reportError(error){
	_viewData.error = error;
	Store.emitChange();
    }
	
});
    
module.exports = Store;

