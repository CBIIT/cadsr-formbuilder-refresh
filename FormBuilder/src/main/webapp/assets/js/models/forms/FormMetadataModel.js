import {Model} from 'backbone';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';

const FormMetadataModel = Model.extend({
	defaults: {
		createdBy:           '',
		longName:            '',
		protocols:           [{
			protoIdseq: "1B80E8BB-7546-7F0B-E050-BB89AD437420",
			longName: ""
		}],
		classifications:	 [{
			csCsiIdseq: "",
			classSchemaLongName: ""
		}],
		context:             {
			/* Note: Intentional misspelling. equates to contextIdseq */
			conteIdseq: null
		},
		formType:            'CRF',
		formCategory:        '',
		preferredDefinition: '',
		publicId:            '',
		workflow:            'DRAFT NEW',
		version:             '1.0',
		headerInstructions:  '',
		footerInstructions:  ''
	},
	urlRoot:  ENDPOINT_URLS.FORMS_DB
});

export default FormMetadataModel;