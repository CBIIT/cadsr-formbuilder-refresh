import {Model} from 'backbone';
import QuestionsColllection from './QuestionsColllection';

const FormModuleModel = Model.extend({
	idAttribute: "moduleIdSeq",
	defaults: {
		/* isEdited is used for the backend to know if this is an existing module being edited */
		isEdited:     false,
		longName:     "",
		instructions: "",
		questions:    new QuestionsColllection()
	}
});

export default FormModuleModel;