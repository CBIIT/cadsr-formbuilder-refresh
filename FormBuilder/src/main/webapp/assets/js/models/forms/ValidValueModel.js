import {Model} from 'backbone';

const ValidValueModel = Model.extend({
	defaults: {
		longName:                        "",
		formValueMeaningText:            "",
		formValueMeaningPublicIdVersion: "",
		formValueMeaningDesc:            "",
		/* used for editing */
		instruction:                     "",
		alternateFormValueMeaningText:   "",
		alternateFormValueMeaningDesc:   ""
	}
});

export default ValidValueModel;