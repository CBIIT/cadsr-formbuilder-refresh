import {Model} from 'backbone';

const FormModuleModel = Model.extend({
	idAttribute: "moduleIdSeq",
	defaults: {
		isEdited: false,
		longName: "",
		instructions: ""
	}
});

export default FormModuleModel;