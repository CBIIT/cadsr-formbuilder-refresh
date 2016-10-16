import {Model} from 'backbone';

const FormModuleModel = Model.extend({
	defaults:    {
		longName:     "",
		instructions: "",
		numQuestions:    0
	}
});

export default FormModuleModel;