import {Model} from 'backbone';

const SearchResultModel = Model.extend({
	defaults: {
		/* same as search query longName */
		formLongName:  '',
		protocolLongName: '',
		contextName:       '',
		/*TODO confirm this is the workflow status */
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