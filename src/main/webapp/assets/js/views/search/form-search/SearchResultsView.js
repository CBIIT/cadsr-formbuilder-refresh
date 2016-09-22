import Backbone from 'backbone';
import $ from 'jquery';
import {View} from 'backbone.marionette';
import {Grid, Extension, UriCell} from "backgrid";
import template from '../../../../templates/search/form-search/search-results-layout.html';
import SelectAllHeaderCell from 'backgrid-select-all';
/* backgridPaginator is just meant to give the import a namespace but isn't used by name below */
import  backgridPaginator from 'backgrid-paginator';

/* Cell which displays a link based on a column's module value for the anchor value and another model attribute for the href. View can be extended to set:
 *   Credit: http://can-we-code-it.blogspot.com/2015/06/a-backgrid-cell-for-displaying-link-to.html
 */
const CustomURICell = UriCell.extend({
	render () {
		this.$el.empty();
		const rawValue = this.model.get(this.column.get("name"));
		const formattedValue = this.formatter.fromRaw(rawValue, this.model);
		this.$el.append($("<a>", {
			href:   `${this.hrefPrefix}${this.model.attributes[this.uri]}`,
			title:  this.title || formattedValue,
			target: '_self'
		}).text(formattedValue));
		this.delegateEvents();
		return this;
	}
});

const columns = [{
	name:     "longName",
	label:    "Long Name",
	editable: false,
	cell:     CustomURICell.extend({uri: 'formIdseq', hrefPrefix: "#forms/"}),
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

const SearchResultsView = View.extend({
	template: template,
	regions:  {
		searchResultsTable: '.results-table',
		paginator:          '.paginator'
	},
	onBeforeAttach(){
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