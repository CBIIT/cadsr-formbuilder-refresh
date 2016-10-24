import {Model} from 'backbone';

const FormModuleModel = Model.extend({
	idAttribute: "moduleIdseq",
	defaults:    {
		longName:     "",
		instructions: "",
		numQuestions:    0
	}
});

export default FormModuleModel;