import {Model} from 'backbone';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';

const CoreFormDetailsModel = Model.extend({
	defaults: {
		createdBy:              '',
		longName:                '',
		protocols:[{
			protoIdseq: "1B80E8BB-7546-7F0B-E050-BB89AD437420"
		}],
		context: {
			/* Note: Intentional misspelling. equates to contextIdseq */
			conteIdseq: null
		},
		formType: '',
		formCategory:           '',
		preferredDefinition:               '',
		workflow:               'DRAFT NEW',
		version:                '1.0',
		instructions:           '',
		footerInstructions:     ''
	},
	urlRoot: ENDPOINT_URLS.FORM_CREATE
});

export default CoreFormDetailsModel;