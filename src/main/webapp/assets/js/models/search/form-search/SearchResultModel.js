import {Model} from 'backbone';

const SearchResultModel = Model.extend({
	defaults: {
		/* same as search query longName */
		formLongName:  '',
		/*Populates the Protocol Long Name in the search results table */
		delimitedProtocolLongNames: '',
		contextName:       '',
		/* this is the workflow status */
		aslName:      '',
		/*TODO where did this come from?*/
		categoryName:  '',
		formType:          '',
		classification: '',
		publicId: '',
		version: '',
	}
});

export default SearchResultModel;