const EVENTS = {
	APP:    {
		SET_MAIN_CONTENT_LAYOUT: 'set:mainContentLayout'
	},
	FORM:   {
		CREATE_FORM:                    'createForm',
		CREATE_MODULE:                     "create:module",
		SET_NEW_MODULE:                     "set:newModule",
		SET_FORM_LAYOUT:                'set:formLayout',
		GET_FORM_CORE_DETAILS_CRITERIA: 'get:getDropDownOptionsSuccess',
		SET_CORE_FORM_DETAILS:          "set:formMetadata"
	},
	SEARCH: {
		SEND_SEARCH_LAYOUT:       'set:searchLayout',
		SEND_SEARCH_INPUTS:       'send:searchInputs',
		RESULTS_COLLECTION_RESET: 'search:resultsCollectionReset'
	},
	USER:   {
		GET_USERNAME: 'get:userName'
	}
};

export default EVENTS;