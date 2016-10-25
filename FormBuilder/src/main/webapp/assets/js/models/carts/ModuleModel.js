import {Model} from 'backbone';
import QuestionsCollection from '../forms/QuestionsCollection';


const FormModuleModel = Model.extend({
	constructor(attributes, options) {
		/* Pass any questions into new QuestionsCollection so each nested object becomes a QuestionsModel */
		if(attributes.questions) {
			attributes.questions = new QuestionsCollection(attributes.questions);
		}
		Model.apply(this, arguments);
	}
});

export default FormModuleModel;