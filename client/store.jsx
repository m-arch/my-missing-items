import assign from 'object-assign';
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';

var _viewData = {};

var Store = assign({}, EventEmitter.prototype, {
    /**
     * Get the entire collection of Items.
     * @return {object}
     */
    getData() {
	$.ajax({
	    url: '/appdata',
	    dataType: 'json',
	    cache: false,
	    success: function(response){
		if(response.success == true)
		    {
			_viewData = response.data;
			return  response.data;
			Store.emitChange();
		    }
		else
		    {
			handleResponse(response.error.code, response.error.message);		    
		    }
	    },
	    error: function(xhr, status, err){
		alert(err);
		console.error(status, err.toString())
	    }
	});
    },

    saveData() {
	return _viewData;
    },

    addItem(data){
	_viewData.inventory.push(data);
	Store.emitChange();
    },

    emitChange() {
	this.emit(CHANGE_EVENT);
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
    
    
});
    
module.exports = Store;

