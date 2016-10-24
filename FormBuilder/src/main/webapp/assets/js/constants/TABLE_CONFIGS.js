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
			name: 'PROTOCOL LONG NAME',
			clickable: true
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
			key: 'csName',
			name: 'CS NAME',
			clickable: true
		},
		{
			key: 'csiName',
			name: 'CSI NAME'
		},
		{
			key: 'definition',
			name:'DEFINITION'
		},
		{
			key: 'csContext',
			name: 'CS CONTEXT'
		},
		{
			key: 'csPublicId',
			name: 'CS PUBLIC ID'
		},
		{
			key: 'csVersion',
			name: 'CS VERSION'
		}
	]

};

export default TABLECONFIG;