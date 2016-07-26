import {Collection} from 'backbone';
import SearchResultsModel from "../../models/SearchFormModel";

export const SearchFormCollection = Collection.extend({
	model: SearchResultsModel
});