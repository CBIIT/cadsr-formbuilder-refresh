import {Model} from 'backbone';

const FormModuleModel = Model.extend({
	idAttribute: "moduleIdSeq",
	defaults: {
		/* isEdited is used for the backend to know if this is an existing or newly added module being sent to it */
		isEdited: false,
		longName: "",
		instructions: ""
	}
});

export default FormModuleModel;