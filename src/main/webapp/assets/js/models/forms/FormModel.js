import {Model} from 'backbone';
import FormModulesCollection from './FormModulesColllection';
import FormMetadata from './FormMetadataModel';

const FormModel = Model.extend({
	idAttribute: "formIdseq",
	defaults: {
		formMetadata: new FormMetadata(),
		formModules:  new FormModulesCollection()
	}
});

export default FormModel;