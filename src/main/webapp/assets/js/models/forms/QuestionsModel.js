import {Model} from 'backbone';
import ValidValuesCollection from './ValidValuesCollection';

const QuestionsModel = Model.extend({
	idAttribute: "quesIdseq",
	defaults: {
		cdeId: "",
		version: "1.0",
		preferredQuestionText : "",
		mandatory: false,
		editable: false,
		instructions: "",
		longName: "",
		dataType: "",
		unitOfMeasure: "",
		displayFormat: "",
		concepts: "",
		/* used for editing */
		defaultValue: "",
		instruction: "",
		cdeWorkflow: "",
		alternateQuestionText: "",
		validValues: new ValidValuesCollection(),
		/* isEdited used for letting the backend know whether this has changed */
		isEdited: false
	},
	constructor(attributes, options) {
		/* Pass any validValues into new ValidValuesCollection so each nested object becomes a ValidValueModel */
		if(attributes.validValues) {
			attributes.validValues = new ValidValuesCollection(attributes.validValues);
		}
		Model.apply(this, arguments);
	}
});

export default QuestionsModel;