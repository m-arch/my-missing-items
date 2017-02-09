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
	error: null,
	supplierData: null,
	page: 0,
    }
}

function getPageView() {
    return {	
	data: Store.reloadData(),
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
		<ul className="accordion" data-accordion>
		    <li className="accordion-navigation">
			<a>New Supplier</a>
			<div id="newsupplier" className="content active row">
			    <div className="small-12 columns">
				<NewSupplierForm />
			    </div>
			</div>
		    </li>
		    <li className="accordion-navigation">
			<a>Weekly</a>
			<div id="weekly" className="content active row">
			    <div className="small-12 columns">
				<SupplierWeeklyReport supplierData={this.state.supplierData} suppliers={this.state.suppliers}/>
			    </div>
			</div>
		    </li>
		</ul>
		<div className="filter-row">
		    <div className="row">
			<div className="small-12 columns">
			    <dl className="sub-nav">
				<dd><a onClick={this._setPage.bind(this, true)}> {this.state.leftArrow  ? "previous      ": ""}</a></dd>
				<dd className="active">page{this.state.page}</dd>
				<dd><a onClick={this._setPage.bind(this, false)}> {this.state.data && this.state.data.inventory.length > 10 && this.state.rightArrow ? "next": null}</a></dd>
			    </dl>
			</div>
		    </div>
		</div>
		<div className="main-row" >
		    <div className="small-12 columns">
			<div className="row">
			    <ListDailyItems page={this.state.page} data={this.state.data}/>  
			    <div className="space-row"/>
			    <div className="space-row"/>
			    <NewItemForm />
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
	    var counted = this.props.page * 10;
	    var items = this.props.data.inventory.map(function(item, i){
		if(i >= counted && i < counted + 10){
		    return (
			<tr key={item._id}>
			    <td>{item.code}</td>
			    <td>{item.description}</td>
			    <td>{item.quantity}</td>
			    <td>{item.supplier}</td>
			    <td>{new Date(item.savedOn).toLocaleString()}</td>
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


