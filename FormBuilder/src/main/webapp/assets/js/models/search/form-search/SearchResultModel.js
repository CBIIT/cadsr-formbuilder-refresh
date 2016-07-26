import {Model} from 'backbone';

const SearchResultModel = Model.extend({
	default: {
		formLongName:  '',
		protocolIdSeq: '',
		context:       '',
		workflow:      '',
		categoryName:  '',
		type:          '',
		classification: '',
		publicId: ''
	}
});

export default SearchResultModel;