import {Model} from 'backbone';

const ClassificationModel = Model.extend({
	defaults : {
		csiIdseq: 				null,
		csCsiIdseq: 			null,
		csiDescription:			null,
		parentCscsiId: 			null,
		csIdseq: 				null,
		csConteIdseq: 			null,
		acCsiIdseq: 			null,
		csID: 					"",
		csVersion: 				0,
		csiId: 					0,
		csiVersion: 			null,
		csContext: 				null,
		classSchemeLongName: 	"",
		classSchemeItemName: 	"",
		classSchemeType: 		null,
		classSchemeItemType:	null,
		classSchemePrefName: 	null,
		classSchemeDefinition: 	""
	}
});

export default ClassificationModel;