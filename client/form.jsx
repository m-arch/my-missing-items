var React = require('react');
var Store = require('./store.jsx');
var errors = require('../utils/errors.js');

///////////////////////////////////
var ErrorForm = React.createClass({
    getInitialState: function(){
	return {
	    error: this.props.error,
	}
    }, 
    
    _closeError: function(){
	this.state.error = null;
    },
    
    render: function(){
	return(
	    <div>
		{
		    this.props.error ?
		    <div data-alert className="alert-box info radius">
			{this.props.error}
		    </div>		
		    :
		    null
		}
	    </div>
	);
    }
});


var NewItemForm = React.createClass({
    getInitialState: function(){
	return {
	    code: "",
	    description: "",
	    quantity: "",
	    supplier: ""
	}
    },  
    
    _onChange: function(event){ 
	if(event){
	    this.setState({[event.target.name]: event.target.value});
	}
    },
    
    _onKeyPress: function(nextName, event){
	var _this = this;
	if(event.key == 'Enter'){
	    this.setState({[event.target.name]: event.target.value});
	    if(nextName == "code"){
	        _this.state.supplier = event.target.value;
		Store.supplierExistsP(_this.state.supplier, function(yes){
		    if(yes){
			Store.addItem(_this.state);
			for(var ref in _this.refs){
			    _this.setState({[_this.refs[ref].name]: ""});
			}
		    }else{
			Store.reportError(errors.supplierNotInList);
		    }
		});
	    }
	    _this.refs[nextName].focus();
	}
    },

    _onClick: function(id){
	console.log(document.getElementById(id).value);
    },


    render: function() {
	return(
	    <div>
		<div className="small-3 columns">
		    <label className="input-label">Code
			<input type="text" value={this.state.code} placeholder="Code" ref="code" name="code" onChange={this._onChange} id="n-inventory-code" onKeyPress={(event) => this._onKeyPress("description", event)} onClick={this._onClick.bind(this, "n-inventory-code")} />
		    </label>
		</div>
		<div className="small-5 columns">
		    <label className="input-label">Description
			<input type="text" placeholder="Description here" value={this.state.description} name ="description" ref="description" id="n-inventory-description" onChange={this._onChange} onKeyPress={(event) => this._onKeyPress("quantity", event)} onClick={this._onClick.bind(this, "n-inventory-description")}/>
		    </label>
		</div>
		<div className="small-1 columns">
		    <label className="input-label">Qty
			<input type="text" placeholder="0" value={this.state.quantity} ref="quantity" name="quantity" onChange={this._onChange} onKeyPress={(event) => this._onKeyPress("supplier", event)}/>
		    </label>
		</div>
		<div className="small-3 columns">
		    <label className="input-label">Supplier
			<input type="text" placeholder="Supplier" id="n-inventory-supplier" value={this.state.supplier} ref="supplier" name="supplier" onChange={this._onChange} onKeyPress={(event) => this._onKeyPress("code", event)} onClick={this._onClick.bind(this, "n-inventory-supplier")}/>
		    </label>
		</div>
	    </div>
	);
    }
});

var NewSupplierForm = React.createClass({
    getInitialState: function(){
	return {
	    name: "",
	    email: "",
	    whatsapp: "",
	    fax: ""
	}
    },
    
    _onChange: function(event){ 
	if(event){
	    this.setState({[event.target.name]: event.target.value});
	}
    },
    
    _onKeyPress: function(nextName, event){
	var _this = this;
	if(event.key == 'Enter'){
	    if(nextName == "name"){
		Store.supplierExistsP(_this.state.name, function(yes){
		    if(yes)
			Store.reportError(errors.alreadyExists);
		    else{
			Store.addSupplier(_this.state);
			for(var ref in _this.refs){
			    _this.setState({[_this.refs[ref].name]: ""});
			}
		    }
		});
	    }
	    this.refs[nextName].focus(); 
	}
    },
    
    _saveButton: function(){
	var _this = this;
	Store.supplierExistsP(_this.state, function(yes){
	    if(yes)
		Store.reportError(errors.alreadyExists);
	    else{
		Store.addSupplier(_this.state);
		for(var ref in _this.refs){
		    _this.setState({[_this.refs[ref].name]: ""});
		}
	    }
	})
    },
    
    render: function() {
	return(
	    <div>
		<div className="row">
		    <div className="small-12 columns">
			<label className="input-label">Name
			    <input type="text" value={this.state.name} placeholder="Name" ref="name" name="name" onChange={this._onChange} onKeyPress={(event) => this._onKeyPress("email", event)} />
			</label>
		    </div>
		</div>
		<div className="row">
		    <div className="small-12 columns">
			<label className="input-label">Email
			    <input type="text" value={this.state.email} placeholder="Email" ref="email" name="email" onChange={this._onChange} onKeyPress={(event) => this._onKeyPress("whatsapp", event)} />
			</label>
		    </div>
		</div>
		<div className="row">
		    <div className="small-12 columns">
			<label className="input-label">Whatsapp
			    <input type="text" value={this.state.whatsapp} placeholder="Whatsapp" ref="whatsapp" name="whatsapp" onChange={this._onChange} onKeyPress={(event) => this._onKeyPress("fax", event)} />
			</label>
		    </div>
		</div>
		<div className="row">
		    <div className="small-12 columns">
			<label className="input-label">Fax
			    <input type="text" value={this.state.fax} placeholder="Fax" ref="fax" name="fax" onChange={this._onChange} onKeyPress={(event) => this._onKeyPress("name", event)} />
			</label>
		    </div>
		</div>
		<div className="row">
		    <div className="small-4 columns" />
		    <div className="small-4 columns">
			<a onClick={this._saveButton}>Save</a>
		    </div>
		    <div className="small-4 columns" />
		</div>
	    </div>
	)
    }
});

var SelectSupplierInput = React.createClass({
    getInitialState: function(){
	return {
	    selected: null,
	}
    },

    _onSelect: function(event){
	Store.setSupplierWeeklyData(event.target.value);
    },
    
    render: function(){
	var _this = this;
	var options = this.props.options.map((option) =>{
	    return(
		<option key={option.value} onClick={_this._onSelect} value={option.value? option.value : option}>{(option.value && option.name) ? option.name : option.value? option.value : option}</option>
	    );
	});
	return(
	    <select onChange={this._onSelect}> 
		{options}
	    </select>
	)
    }
});

module.exports = {
    NewItemForm: NewItemForm,
    NewSupplierForm: NewSupplierForm,
    ErrorForm: ErrorForm,
    SelectSupplierInput: SelectSupplierInput
}
    
