var React = require('react');
var Store = require('./store.jsx');
var NewSupplierForm = require('./form.jsx').NewSupplierForm;
var NewItemForm = require('./form.jsx').NewItemForm;
var ErrorForm = require('./form.jsx').ErrorForm;
var SupplierWeeklyReport = require('./report.jsx').SupplierWeeklyReport;


function startApp() {
    return {
	data: Store.getData(),
	suppliers: [],
	item: null,
	error: null,
	supplierData: null,
	page: 0,
    }
}

function getPageView() {
    return {	
	data: Store.reloadData(),
	item: Store.getItem(),
	suppliers: Store.getSuppliers(),
	error: Store.getError(),
	supplierData: Store.getWeeklySupplierData(),
	leftArrow: false,
	rightArrow: true,
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
    
    _closeError: function(){
	this.setState({error: null});
    },
    
    _setPage: function(downP){
	if(downP){
	    var page = this.state.page -1;
	}else{
	    var page = this.state.page +1;
	}
	console.log(page);
	if(((page + 1) * 10) > this.state.data.inventory.length){
	    this.state.rightArrow = false;
	}else{
	    this.state.rightArrow = true;
	}
	if(page -1 >= 0)
	    this.setState({leftArrow: true});
	else{
	    this.setState({leftArrow: false});
	}
	this.setState({page: page});
    },


    render: function() {
	return (
	    <div>
		<ErrorForm error={this.state.error}/>
		<a onClick={this._closeError} className="close">{this.state.error ? "x" : null}</a>
		<div className="">
		    <div className="space-row"/>
		    <div className="small-12 medium-6 large-7 columns">
			<div className="row">
			    <dl className="sub-nav">
				<dd><a onClick={this._setPage.bind(this, true)}> {this.state.leftArrow  ? "previous      ": ""}</a></dd>
				<dd className="active">page{this.state.page}</dd>
				<dd><a onClick={this._setPage.bind(this, false)}> {this.state.data && this.state.data.inventory.length > 10 && this.state.rightArrow ? "next": null}</a></dd>
			    </dl>
			</div>
			<div className="row">
			    <ListDailyItems page={this.state.page} data={this.state.data}/>  
			    <div className="space-row"/>
			    <div className="space-row"/>
			    <NewItemForm />
			</div>
		    </div>
		    <div className="small-0 medium-1 large-1 columns"></div>
		    <div className="space-row"/>
		    <div className="small-12 medium-5 large-4 columns">
			<h3>New Supplier</h3>
			<div id="newsupplier" className="content active row">
			    <div className="small-12 columns">
				<NewSupplierForm />
			    </div>
			</div>
			<h3>Weekly</h3>
			<div id="weekly" className="content active row">
			    <div className="small-12 columns">
				<SupplierWeeklyReport supplierData={this.state.supplierData} suppliers={this.state.suppliers}/>
			    </div>
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

    _onClick: function(id, event){
	Store.editItem(id, event.target);
    },

    _toggleItem: function(id, status){
	Store.toggleItem(id, status);
    },

    render: function() {
	if(this.props.data && this.props.data.inventory){
	    var counted = this.props.page * 10;
	    var items = this.props.data.inventory.map(function(item, i){
		if(i >= counted && i < counted + 10){
		    return (
			<tr onClick={(event) => this._onClick(item._id, event)} key={item._id} id={item._id} onKeyPress={(event) => this._onKeyPress(event)}>
			    <td name="code">{item.code}</td>
			    <td name="description">{item.description}</td>
			    <td name="quantity">{item.quantity}</td>
			    <td name="supplier">{item.supplier}</td>
			    <td>{new Date(item.savedOn).toLocaleString()}</td>
			    {item.foundP && item.foundP == 'true' ? 
			     <input type="checkbox" name="found" onClick={this._toggleItem.bind(this, item._id, false)} checked/> :
			     <input type="checkbox" name="found" onClick={this._toggleItem.bind(this, item._id, true)} />
			    }
			</tr>
		    );
		}else{
		    return null;
		}
	    }.bind(this));
	    return(
		<table>
		    <thead>
			<tr>
			    <th width="250">Code</th>
			    <th>Description</th>
			    <th width="50">Qty</th>
			    <th width="150">Supplier</th>
			    <th width="100">Date</th>
			</tr>
		    </thead>
		    <tbody>
			{items}
		    </tbody>
		</table>
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


