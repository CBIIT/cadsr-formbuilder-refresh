import {Model} from 'backbone';

const SearchContextRestrictionModel = Model.extend({
	defaults: {
		TEST:     false,
		TRAINING: false
	}
});

const searchContextRestrictionModel= new SearchContextRestrictionModel();

export default searchContextRestrictionModel;