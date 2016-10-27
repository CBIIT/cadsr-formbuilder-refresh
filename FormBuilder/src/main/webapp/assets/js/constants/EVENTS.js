/**
 * event names meant to be used by Backbone Events/Backbone Radio
 * @type {{APP: {SET_MAIN_CONTENT_LAYOUT: string}, FORM: {CREATE_FORM: string, EDIT_FORM: string, CREATE_MODULE: string, SET_NEW_MODULE: string, SAVE_FORM: string, SET_MODULE: string, SET_FORM_LAYOUT: string, GET_FORM_CORE_DETAILS_CRITERIA: string, SET_CORE_FORM_DETAILS: string, VIEW_MODULE: string}, SEARCH: {SEND_SEARCH_LAYOUT: string, SEND_SEARCH_INPUTS: string, RESULTS_COLLECTION_RESET: string}, USER: {GET_USERNAME: string}}}
 */
const EVENTS = {
	APP:    {
		SET_MAIN_CONTENT_LAYOUT: 'set:mainContentLayout',
		ADD_MODULE_FROM_FORM_TO_CART:        "add:moduleFromModuleCart",
	},
	FORM:   {
		CANCEL_EDIT_FORM:               'cancelEditForm',
		CREATE_FORM:                    'createForm',
		EDIT_FORM:                      'editForm',
		CREATE_MODULE:                  "create:module",
		CREATE_QUESTION_FROM_CDE:        "create:questionFromCde",
		ADD_MODULE_FROM_CART:        "add:moduleFromModuleCart",
		GET_MODULE: "get:module",
		GET_FORM_ACTION_MODE: "get:formActionMode",
		SET_NEW_MODULE:                 "set:newModule",
		SAVE_FORM:                      'saveForm',
		SET_MODULE:                     "set:module",
		SET_QUESTION:                     "set:question",
		SET_VALID_VALUE:                     "set:validValue",
		SET_FORM_LAYOUT:                'set:formLayout',
		GET_FORM_CORE_DETAILS_CRITERIA: 'get:getDropDownOptionsSuccess',
		SET_CORE_FORM_DETAILS:          "set:formMetadata",
		VIEW_MODULE:                    "view:module",
	},
	SEARCH: {
		SEND_SEARCH_LAYOUT:       			'set:searchLayout',
		SEND_SEARCH_INPUTS:       			'send:searchInputs',
		RESULTS_COLLECTION_RESET: 			'search:resultsCollectionReset',
		PROTOCOLS_SEARCH_INPUTS:			'send:protocolSearch',
		PROTOCOLS_COLLECTION_RESET:			'search:protocolsCollectionReset',
		CLASSIFICATIONS_SEARCH_INPUTS:		'send:classificationSearch',
		CLASSIFICATIONS_COLLECTION_RESET:	'search:classificationsCollectionReset'
		
	},
	USER:   {
		GET_USERNAME:  'get:userName',
		LOGIN_SUCCESS: "loginSuccess"
	},
	CARTS:  {
		GET_MODULE_MODEL: 'get:moduleFromModuleCart',
		GET_QUESTION_MODEL: 'get:questionModel',
		GET_CART_DATA: 'get:cartData',
		SET_LAYOUT: 'set:layout',
		GET_DOWNLOAD_XLS: 'get:downloadXLS',
		GET_DOWNLOAD_XML: 'get:downloadXML',
		MODULE_CART_UPDATED: 'moduleCart:updated',
		CDE_CART_UPDATED: 'cdeCart:updated',
		REMOVE_CART_ITEM: 'remove:cartItem',
		SET_LAST_CART_SORTED_BY: 'set:LastCartSortedBy'
	}
};

export default EVENTS;