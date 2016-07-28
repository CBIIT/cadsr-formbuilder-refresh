import Backbone from 'backbone';
import Backgrid from "backgrid";
import SelectAllHeaderCell from 'backgrid-select-all';
import Paginator from 'backgrid-paginator';

var columns = [{
	name: "id",
	editable: false,
	cell: Backgrid.IntegerCell.extend({
		orderSeparator: ''
	})
}, {
	name: "name",
	cell: "string"
}, {
	name: "pop",
	cell: "integer"
}, {
	name: "percentage",
	cell: "number"
}, {
	name: "date",
	cell: "date"
}, {
	name: "url",
	cell: "uri"
}];

const SearchResultsView = Backgrid.Grid.extend({
	columns: [{
		// enable the select-all extension
		name: "",
		cell: "select-row",
		headerCell: "select-all"
	}].concat(columns),
	emptyText: "No Data is available"
});

/*var paginator = Paginator.extend({
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

	collection: resultsCollection
});*/

export default SearchResultsView;
