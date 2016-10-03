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
	}
});

export default QuestionsModel;