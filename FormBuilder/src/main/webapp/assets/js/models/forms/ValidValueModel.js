import {Model} from 'backbone';

const ValidValueModel = Model.extend({
	idAttribute: "valueIdseq",
	defaults: {
		longName:                        "",
		formValueMeaningText:            "",
		formValueMeaningPublicIdVersion: "",
		formValueMeaningDesc:            "",
		/* used for editing */
		instruction:                     "",
		alternateFormValueMeaningText:   "",
		alternateFormValueMeaningDesc:   "",
		/* isEdited used for letting the backend know whether this has changed */
		isEdited: false
	}
});

export default ValidValueModel;