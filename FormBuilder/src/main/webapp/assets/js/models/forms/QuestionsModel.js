import {Model} from 'backbone';
import ValidValuesCollection from './ValidValuesCollection';

const QuestionsModel = Model.extend({
	defaults: {
		cdeId: "",
		version: "1.0",
		preferredQuestionText : "",
		isMandatory: false,
		isEditable: false,
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
		validValues: new ValidValuesCollection()
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