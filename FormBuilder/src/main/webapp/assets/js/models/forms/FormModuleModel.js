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
	},
	initialize() {
		console.log("adsf");
	},
	constructor(attributes, options) {
		/* Pass any questions into new QuestionsCollection so each nested object becomes a QuestionsModel */
		if(attributes.questions) {
			attributes.questions = new QuestionsCollection(attributes.questions);
		}
		Model.apply(this, arguments);
	}
});

export default FormModuleModel;