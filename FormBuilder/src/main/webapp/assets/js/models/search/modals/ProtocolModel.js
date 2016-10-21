import {Model} from 'backbone';

const ProtocolModel = Model.extend({
	defaults : {
	    createdBy: 			null,
	    modifiedBy: 		null,
	    preferredName: 		'',
	    preferredDefinition:'',
	    longName: 			'',
	    aslName: 			null,
	    version: 			null,
	    deletedInd: 		null,
	    conteIdseq: 		null,
	    context: 			null,
	    designations: 		null,
	    publicId: 			0,
	    origin: 			null,
	    idseq: 				null,
	    registrationStatus: null,
	    definitions: 		null,
	    contacts: 			null,
	    registryId: 		null,
	    protoIdseq: 		null,
	    leadOrg: 			null,
	    type: 				null,
	    phase: 				null,
	    endDate: 			null,
	    beginDate: 			null,
	    protocolId: 		null,
	    latestVersionInd: 	null,
	    refereceDocs: 		null,
	    isPublished: 		false,
	    dateCreated: 		null,
	    dateModified: 		null
	}
});

export default ProtocolModel;