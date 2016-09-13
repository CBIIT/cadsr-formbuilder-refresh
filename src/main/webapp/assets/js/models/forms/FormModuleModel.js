import {Model} from 'backbone';

const FormModuleModel = Model.extend({
	idAttribute: "moduleIdSeq",
	defaults: {
		longName: "",
		instructions: ""
	}
});

export default FormModuleModel;