var React = require('react');
var Store = require('./store.jsx');

///////////////////////////////////
var FormInput = React.createClass({
    getInitialState: function(){
	return {
	    code: "",
	    description: "",
	    quantity: "",
	    supplier: ""
	}
    },  
    componentDidMount: function() {
	Store.addChangeListener(this._onChange);
    },
    
    componentWillUnmount: function() {
	//TlobfitStore.removeChangeListener(this._onChange);
    },  
    
    _onChange: function(event){ 
	if(event){
	    this.setState({[event.target.name]: event.target.value});
	}
    },
    
    _onKeyPress: function(nextName, event){
	if(event.key == 'Enter'){
	    if(nextName == "code"){
		Store.addItem(this.state);
		for(var ref in this.refs){
		    this.setState({[this.refs[ref].name]: ""});
		}
	    }
	    this.refs[nextName].focus();
	}
    },
    
    render: function() {
	return(
	    <div className="row">
		<div className="small-3 columns">
		    <label className="input-label">Code
			<input type="text" value={this.state.code} placeholder="Code" ref="code" name="code" onChange={this._onChange} onKeyPress={(event) => this._onKeyPress("description", event)} />
		    </label>
		</div>
		<div className="small-5 columns">
		    <label className="input-label">Description
			<input type="text" placeholder="Description here" value={this.state.description} name ="description" ref="description" onChange={this._onChange} onKeyPress={(event) => this._onKeyPress("quantity", event)}/>
		    </label>
		</div>
		<div className="small-1 columns">
		    <label className="input-label">Qty
			<input type="text" placeholder="0" value={this.state.quantity} ref="quantity" name="quantity" onChange={this._onChange} onKeyPress={(event) => this._onKeyPress("supplier", event)} />
		    </label>
		</div>
		<div className="small-3 columns">
		    <label className="input-label">Supplier
			<input type="text" placeholder="Supplier" value={this.state.supplier} ref="supplier" name="supplier" onChange={this._onChange} onKeyPress={(event) => this._onKeyPress("code", event)}/>
		    </label>
		</div>
	    </div>
	);
    }
});

module.exports = FormInput;
