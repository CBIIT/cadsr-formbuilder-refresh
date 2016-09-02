import {Model} from 'backbone';

const FormModuleModel = Model.extend({
	defaults: {
		name: "",
		instructions: ""
	}
});

export default FormModuleModel;