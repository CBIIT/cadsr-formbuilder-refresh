import PageableCollection from 'backbone.paginator';
import SearchResultModel from "../../../models/search/form-search/SearchResultModel";

const SearchResultsCollection = PageableCollection.extend({
	model:   SearchResultModel,
	/* baseUrl is a custom property. the "url" property is constructed after the UI input data is gathered */
	baseUrl: serverProps.searchEndPointUrl,
/*	state:   {
		pageSize: 100
	},*/
	mode:    "client"
});

export default SearchResultsCollection;