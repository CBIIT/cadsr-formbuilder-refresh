import {Model} from 'backbone';
import QuestionsCollection from './QuestionsCollection';

const FormModuleModel = Model.extend({
	idAttribute: "moduleIdseq",
	defaults:    {
		/* isEdited is used for the backend to know if this is an existing module being edited */
		isEdited:     false,
		longName:     "",
		instructions: "",
		questions:    new QuestionsCollection()
	}
});

export default FormModuleModel;