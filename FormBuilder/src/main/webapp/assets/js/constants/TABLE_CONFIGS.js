/**
 * Created by nmilos on 10/6/16.
 */
const TABLECONFIG = {
	CDE: [
		{
			key: 'longname',
			name: 'Long Name',
			sort: ''
		},
		{
			key: 'longcdename',
			name: 'Doc Text',
			sort: ''
		},
		{
			key: 'contextname',
			name: 'Context',
			sort: ''
		},
		{
			key: 'registrationstatus',
			name: 'Registration Status',
			sort: ''
		},
		{
			key: 'workflow',
			name: 'Workflow Status',
			sort: ''
		},
		{
			key: 'publicid',
			name: 'ID',
			sort: ''
		},
		{
			key: 'version',
			name: 'Version',
			sort: ''
		}
	],
	MODULE: [
		{
			key: 'longName',
			name: 'Module Name'
		},
		{
			key: 'instructions',
			name: 'Module Instruction'
		},
		{
			key: 'numQuestions',
			name: 'Number of Questions'
		},
		{
			key: 'originFormLongName',
			name: 'Origin Form Long Name'
		},
		{
			key: 'originFormContext',
			name: 'Origin Context'
		},
		{
			key: 'originFormPublicId',
			name: 'Origin Public ID'
		},
		{
			key: 'originFormVersion',
			name: 'Origin Version'
		}
	],
	FORM: [
		{
			key: 'longName',
			name: 'Form Long Name'
		},
		{
			key: 'contextName',
			name: 'Context'
		},
		{
			key: 'protocolLongName',
			name:'Protocol Long Name'
		},
		{
			key: 'workflow',
			name: 'Workflow'
		},
		{
			key: 'publicId',
			name: 'Public Id'
		},
		{
			key: 'createdBy',
			name: 'Created '
		},
		{
			key: 'modifiedBy',
			name: 'Modified'
		},
		{
			key:'version',
			name:'Version'
		}
	],
	SEARCH_FORM: [
		{
			key: 'longName',
			name: 'Form Long Name',
			link: 'true',
			hrefPrefix: 'FormBuilder/forms/',
			uri: 'formIdseq'
		},
		{
			key: 'contextName',
			name: 'Context'
		},
		{
			key: 'delimitedProtocolLongNames',
			name:'Protocol Long Name(s)'
		},
		{
			key: 'aslName',
			name: 'Workflow'
		},
		{
			key: 'publicId',
			name: 'Public Id'
		},
		{
			key: 'createdBy',
			name: 'Created '
		},
		{
			key: 'modifiedBy',
			name: 'Modified'
		},
		{
			key:'version',
			name:'Version'
		}
	],
	SEARCH_PROTOCOL: [
		{
			key: 'longName',
			name: 'PROTOCOL LONG NAME'
		},
		{
			key: 'id',
			name: 'PROTOCOL ID'
		},
		{
			key: 'shortName',
			name:'SHORT NAME'
		},
		{
			key: 'context',
			name: 'CONTEXT'
		},
		{
			key: 'definition',
			name: 'DEFINITION'
		}
	],
	SEARCH_CLASSIFICATION: [
		{
			key: 'longName',
			name: 'CS NAME'
		},
		{
			key: 'publicId',
			name: 'CSI NAME'
		},
		{
			key: 'preferredName',
			name:'DEFINITION'
		},
		{
			key: 'context',
			name: 'CS CONTEXT'
		},
		{
			key: 'preferredDefinition',
			name: 'CS PUBLIC ID'
		},
		{
			key: 'version',
			name: 'CS VERSION'
		}
	]

};

export default TABLECONFIG;