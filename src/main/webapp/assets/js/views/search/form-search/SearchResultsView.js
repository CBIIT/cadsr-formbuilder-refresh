import Backbone from 'backbone';
import {LayoutView} from 'backbone.marionette';
import {Grid, Extension} from "backgrid";
import template from '../../../../templates/search/form-search/search-results-layout.html';
import SelectAllHeaderCell from 'backgrid-select-all';
/* backgridPaginator is just meant to give the import a namespace but isn't used by name below */
import  backgridPaginator from 'backgrid-paginator';

const columns = [{
	/* same as search query formLongName */
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

const Paginator = Extension.Paginator.extend({

	// If you anticipate a large number of pages, you can adjust
	// the number of page handles to show. The sliding window
	// will automatically show the next set of page handles when
	// you click next at the end of a window.
	windowSize: 20, // Default is 10

	// Used to multiple windowSize to yield a number of pages to slide,
	// in the case the number is 5
	slideScale: 0.25, // Default is 0.5

	// Whether sorting should go back to the first page
	goBackFirstOnSort: true // Default is true
});

const ResultsTable = Grid.extend({
	columns:   [{
		// enable the select-all extension
		name:       "",
		cell:       "select-row",
		headerCell: "select-all"
	}].concat(columns),
	emptyText: "No Data is available",
	onAttach() {
		let totalResults = this.collection.state.totalRecords;
		this.$el.before(`<p>Total Results: ${totalResults}</p>`);
	}
});

const SearchResultsView = LayoutView.extend({
	template: template,
	regions:  {
		searchResultsTable: '.results-table',
		paginator:          '.paginator'
	},
	onBeforeShow(){
		//paginator.collection = this.collection;
		this.showChildView('searchResultsTable', new ResultsTable({
			collection: this.collection
		}));
		this.showChildView('paginator', new Paginator({
			collection: this.collection
		}));
	}
});

export default SearchResultsView;