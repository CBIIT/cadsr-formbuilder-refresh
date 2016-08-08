/* serverProps is a global var declared in index.jsp */
const formBuilderHost = serverProps.formBuilderHost;

/**
 *
 * @type {{categories: string, contexts: string, formSearch: string, types: string, workflows: string}}
 */
const ENDPOINT_URLS = {
	CATEGORIES: `${formBuilderHost}/FormService/api/v1/categories`,
	CONTEXTS:   `${formBuilderHost}/FormService/api/v1/contexts`,
	FORM_SEARCH: `${formBuilderHost}/FormService/api/v1/forms`,
	TYPES:      `${formBuilderHost}/FormService/api/v1/types`,
	WORKFLOWS:  `${formBuilderHost}/FormService/api/v1/legacy/workflows`
};

/*Make immutable */
Object.freeze(ENDPOINT_URLS);

export default ENDPOINT_URLS;