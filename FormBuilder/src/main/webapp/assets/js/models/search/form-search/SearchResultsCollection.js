import {Collection} from 'backbone';
import SearchResultModel from "./SearchResultModel";
import ENDPOINT_URLS from '../../../constants/ENDPOINT_URLS';


const SearchResultsCollection = Collection.extend({
	model:   SearchResultModel,
	/* baseUrl is a custom property. the "url" property is constructed after the UI input data is gathered */
	baseUrl: ENDPOINT_URLS.FORMS_DB
});

export default SearchResultsCollection;