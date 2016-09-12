import {Model} from 'backbone';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';
import FormModulesCollection from './FormModulesColllection';
import FormMetadata from './FormMetadataModel';

const FormModel = Model.extend({
	/* Backbone tracks this module via the idAttribute, if it's set */
	idAttribute: "formIdseq",
	defaults: {
		formMetadata: new FormMetadata(),
		formModules:  new FormModulesCollection()
	},
	urlRoot: ENDPOINT_URLS.FORM_SAVE
});

export default FormModel;