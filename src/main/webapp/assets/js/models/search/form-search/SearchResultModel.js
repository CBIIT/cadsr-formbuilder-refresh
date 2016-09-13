import {Model} from 'backbone';

const SearchResultModel = Model.extend({
	defaults: {
		/* same as search query longName */
		formLongName:  '',
		/*Populates the Protocol Long Name in the search results table */
		delimitedProtocolLongNames: '',
		contextName:       '',
		/* aslName this is the workflow status */
		aslName:      '',
		categoryName:  '',
		formType:          '',
		classification: '',
		publicId: '',
		version: '',
	}
});

export default SearchResultModel;