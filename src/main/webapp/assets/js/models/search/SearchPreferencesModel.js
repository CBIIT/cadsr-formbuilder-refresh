import {Model} from 'backbone';

const SearchResultsModel = Model.extend({
	defaults: {
		excludeTestContext:     true,
		excludeTrainingContext: false
	}
});

const searchResultsModel = new SearchResultsModel();

export default searchResultsModel;