import Backbone from 'backbone';
import $ from 'jquery';
import Backgrid from "backgrid";
import SelectAllHeaderCell from 'backgrid-select-all';
/*
import * as Paginator from 'backgrid-paginator';
*/

const columns = [{
	/* same as search query longName */
	name:     "longName",
	label:    "Long Name",
	editable: false,
	cell:     "string"
}, {
	name:     "contextName",
	label:    "Context",
	editable: false,
	cell:     "string"
}, {
	name:     "formType",
	label:    "Type",
	editable: false,
	cell:     "string"
}, {
	name:     "delimitedProtocolLongNames",
	label:    "Protocol Long Name(s)",
	editable: false,
	cell:     "string"
}, {
	name:     "aslName",
	label:    "Workflow Status",
	editable: false,
	cell:     "string"
}, {
	name:     "publicId",
	label:    "Public ID",
	editable: false,
	cell:     "string"
}, {
	name:     "version",
	label:    "Version",
	editable: false,
	cell:     "string"
}];

/*const resultsPaginator = Paginator.extend({
	// If you anticipate a large number of pages, you can adjust
	// the number of page handles to show. The sliding window
	// will automatically show the next set of page handles when
	// you click next at the end of a window.
	windowSize: 20, // Default is 10

	// Used to multiple windowSize to yield a number of pages to slide,
	// in the case the number is 5
	slideScale: 0.25, // Default is 0.5

	// Whether sorting should go back to the first page
	goBackFirstOnSort: false, // Default is true
});*/

const SearchResultsView = Backgrid.Grid.extend({
	columns:   [{
		// enable the select-all extension
		name:       "",
		cell:       "select-row",
		headerCell: "select-all"
	}].concat(columns),
	emptyText: "No Data is available",
	onRender(){
	/*	let paginator = new Paginator({
			collection: this.collection
		});*/
	},
	onAttach() {
		let totalResults = this.collection.length;
		this.$el.before(`<p>Total Results: ${totalResults}</p>`);
	}
});

export default SearchResultsView;