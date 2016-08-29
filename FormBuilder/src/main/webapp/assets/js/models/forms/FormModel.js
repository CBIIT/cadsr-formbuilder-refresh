import {Model} from 'backbone';
import FormMetadata from './FormMetadataModel';

const FormModel = Model.extend({
	defaults: {
		formMetadata: new FormMetadata()
	}
});

export default FormModel;