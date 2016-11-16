import {Model} from 'backbone';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';
import FormModulesCollection from './FormModulesColllection';
import FormMetadata from './FormMetadataModel';

const FormModel = Model.extend({
	idAttribute: "formIdseq",
	urlRoot:     ENDPOINT_URLS.FORMS_DB,
	initialize() {
		this.set({
			formMetadata: new FormMetadata(),
			formModules:  new FormModulesCollection()
		});
	},
	parse(response){
		if(typeof response === "object"){
			const returnedResponse = response;
			/*marshalling nested objects/arrays into it's own collection to map to Backbone's nested model/collection  */
			returnedResponse.formMetadata = new FormMetadata(returnedResponse.formMetadata);
			returnedResponse.formModules = new FormModulesCollection(returnedResponse.formModules);
			return returnedResponse;
		}
	}
});

export default FormModel;