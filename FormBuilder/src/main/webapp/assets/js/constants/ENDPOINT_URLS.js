/* serverProps is a global var declared in index.jsp */
const formBuilderHost = serverProps.formBuilderHost;

/**
 *
 * @type {{CATEGORIES: string, CONTEXTS: string, FORM_SEARCH: string, FORM_CREATE: string, TYPES: string, WORKFLOWS: string}}
 */
const ENDPOINT_URLS = {
	CATEGORIES: `${formBuilderHost}/FormBuilder/api/v1/categories`,
	CONTEXTS:   `${formBuilderHost}/FormBuilder/api/v1/contexts`,
	FORM_SEARCH: `${formBuilderHost}/FormBuilder/api/v1/forms`,
	FORM_CREATE: `${formBuilderHost}/FormBuilder/api/v1/forms`,
	FORM_SAVE: `${formBuilderHost}/FormBuilder/api/v1/forms`,
	TYPES:      `${formBuilderHost}/FormBuilder/api/v1/types`,
	WORKFLOWS:  `${formBuilderHost}/FormBuilder/api/v1/workflows`
};

/*Make immutable */
Object.freeze(ENDPOINT_URLS);

export default ENDPOINT_URLS;