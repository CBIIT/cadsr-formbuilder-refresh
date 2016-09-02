import PageableCollection from 'backbone.paginator';
import SearchResultModel from "./SearchResultModel";
import ENDPOINT_URLS from '../../../constants/ENDPOINT_URLS';


const SearchResultsCollection = PageableCollection.extend({
	model:   SearchResultModel,
	/* baseUrl is a custom property. the "url" property is constructed after the UI input data is gathered */
	baseUrl: ENDPOINT_URLS.FORM_SEARCH,
	state:   {
		pageSize: 50
	},
	mode:    "client"
});

export default SearchResultsCollection;