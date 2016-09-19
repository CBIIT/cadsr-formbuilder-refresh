import {Model} from 'backbone';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';
import FormModulesCollection from './FormModulesColllection';
import FormMetadata from './FormMetadataModel';

const FormModel = Model.extend({
	/* Backbone tracks this module via the idAttribute, if it's set */
	idAttribute: "formIdseq",
	defaults:    {
		formMetadata: new FormMetadata(),
		formModules:  new FormModulesCollection()
	},
	urlRoot:     ENDPOINT_URLS.FORMS,
	parse(response){
		const returnedResponse = typeof response === "string" ? JSON.parse(response) : response;
		/*marshalling nested objects/arrays into it's own collection to map to Backbone's nested model/collection  */
		returnedResponse.formMetadata = new FormMetadata(returnedResponse.formMetadata);
		returnedResponse.formModules = new FormModulesCollection(returnedResponse.formModules);
		return returnedResponse;

	}
});

export default FormModel;