var React = require('react');
var Store = require('./store.jsx');
var FormInput = require('./form.jsx');

function startApp() {
    return {
	data: Store.getData(),
    };
}

function getPageView() {
    return {	
	data: Store.saveData(),
    };
}
	

var InventoryApp = React.createClass({
    
    getInitialState: function() {
	return startApp(); //will initalize pages and variables.
    },

    componentDidMount: function() {
	Store.addChangeListener(this._onChange);
    },

    componentWillUnmount: function(){	
	Store.removeChangeListener(this._onChange);
    },

    render: function() {
	return (
	    <div>
		<div className="row" >
		    <div className="small-12 columns">
			<div className="row">
			    <ListDailyItems data={this.state.data} />  
			    <FormInput />
			</div>
		    </div>
		</div>
	    </div>
	);
    },

    _onChange: function() {
	this.setState(getPageView());
    }
});

var ListDailyItems = React.createClass({
    render: function() {
	if(this.props.data && this.props.data.inventory){
	    alert(JSON.stringify(this.props.data));
	    var items = this.props.data.inventory.map(function(item){
		return (
		    <div key={item.code} className="row">
			<div className="small-3 columns">{item.code}</div>
			<div className="small-5 columns">{item.description}</div>
			<div className="small-1 columns">{item.quantity}</div>
			<div className="small-3 columns">{item.supplier}</div>
		    </div>
		);
	    }.bind(this));
	    return(
		<div className="row">
		    <div className="small-12 columns">
			{items}
		    </div>
		</div>
	    )
	}else{
	    return(
		<div className="row">
		    <div className="middle columns">
			no items yet
		    </div>
		</div>
	    )
	}
    }
});
    
    

module.exports = InventoryApp;


