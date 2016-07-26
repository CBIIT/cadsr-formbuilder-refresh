import Backbone from 'backbone';
import {Grid} from "backgrid";

const columns = [{
	name:     "id",
	label:    "Long Name",
	editable: false,
	cell:     "string"
}, {
	name:     "name",
	label:    "Context",
	editable: false,
	cell:     "string"
}, {
	name:     "pop",
	label:    "Type",
	editable: false,
	cell:     "string"
}, {
	name:     "percentage",
	label:    "Protocol Long Name(s)",
	editable: false,
	cell:     "string"
}, {
	name:     "date",
	label:    "Workflow Status",
	editable: false,
	cell:     "string"
}, {
	name:     "url",
	label:    "Public ID",
	editable: false,
	cell:     "string"
}, {
	name:     "name",
	label:    "Context",
	editable: false,
	cell:     "string"
}];

const SearchResultsView = Grid.extend({
	initialize(options ={}) {
		this.collection = options.collection
	},
	columns: columns,
	emptyText: "No Data is available"
});

export default SearchResultsView;
