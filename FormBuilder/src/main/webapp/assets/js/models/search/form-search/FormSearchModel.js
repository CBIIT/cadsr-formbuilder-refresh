import {Model} from 'backbone';

const FormSearchModel = Model.extend({
	defaults: {
		formLongName:  '',
		protocolIdSeq: '',
		protocolLongName: '',
		module: '',
		cdePublicId: '',
		context:       '',
		workflow:      '',
		categoryName:  '',
		type:          '',
		classification: '',
		publicId: '',
		latestVersionOnly: false
	}
});

export default FormSearchModel;