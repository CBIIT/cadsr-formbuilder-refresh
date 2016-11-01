import {Model} from 'backbone';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';

const FormMetadataModel = Model.extend({
	defaults: {
		createdBy:           '',
		longName:            '',
		protocols:           [],
		classifications:	 [],
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