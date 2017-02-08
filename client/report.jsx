var React = require('react');
var Store = require('./store.jsx');
var SelectSupplierInput = require('./form.jsx').SelectSupplierInput;

///////////////////////////////////
var SupplierWeeklyReport = React.createClass({
    getInitialState: function(){
	return {
	    supplier: null,
	    supplierData: null,
	}
    }, 
    
    render: function(){
	return(
	    <div>
		<dl>
		    <dd><SelectSupplierInput options={this.props.suppliers} /></dd>
		</dl>
		{
		    this.props.supplierData ?
		    <table className="report-table">
			<thead>
			    <tr>
				<th width="150">Code</th>
				<th>Description</th>
				<th width="50">Qty</th>
				<th width="150">Date</th>
			    </tr>
			</thead>
			<SupplierReportLines items={this.props.supplierData} />
		    </table>	
		    :
		    null
		}
	    </div>
	);
    }
});   


var SupplierReportLines = React.createClass({
    render: function(){
	if(this.props.items && this.props.items.length >0){
	    var items = this.props.items.map(function(item){
		return(
		    <tr key={item._id}>
			<td>{item.code}</td>
			<td>{item.description}</td>
			<td>{item.quantity}</td>
			<td>{item.savedOn}</td>
		    </tr>
		);
	    });
	    return(
		<tbody>
		    {items}
		</tbody>
	    );
	}else{
	    return(
		<tbody>
		    <div className="report-message">No data available</div>
		</tbody>
	    )
	}
    }
});


module.exports = {
    SupplierWeeklyReport: SupplierWeeklyReport,    
}
