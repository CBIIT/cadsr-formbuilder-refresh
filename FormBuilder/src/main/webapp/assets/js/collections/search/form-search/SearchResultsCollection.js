import PageableCollection from 'backbone.paginator';
import SearchResultModel from "../../../models/search/form-search/SearchResultModel";

const SearchResultsCollection = PageableCollection.extend({
	model: SearchResultModel,
	url: 'http://localhost:8080/FormService/api/v1/legacy/forms?formLongName=demographics',
	state: {
		pageSize: 50
	},
	mode:  "client"
});

export default SearchResultsCollection;