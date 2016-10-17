/* serverProps is a global var declared in index.jsp */
const formBuilderHost = serverProps.formBuilderHost;

const ENDPOINT_URLS = {
	CATEGORIES:         `${formBuilderHost}/FormBuilder/api/v1/categories`,
	CONTEXTS:           `${formBuilderHost}/FormBuilder/api/v1/contexts`,
	FORMS_DB:           `${formBuilderHost}/FormBuilder/api/v1/forms`,
	FORMS_WORKING_COPY: `${formBuilderHost}/FormBuilder/api/v1/forms/workingCopy`,
	TYPES:              `${formBuilderHost}/FormBuilder/api/v1/types`,
	WORKFLOWS:          `${formBuilderHost}/FormBuilder/api/v1/workflows`,
	CDE_CART:           `${formBuilderHost}/FormBuilder/api/v1/carts/cdecart`,
	MODULE_CART:        `${formBuilderHost}/FormBuilder/api/v1/carts/modulecart`,
	FORM_CART:        `${formBuilderHost}/FormBuilder/api/v1/carts/formcart`,
	FORM_DOWNLOAD_XML: `${formBuilderHost}/FormBuilder/api/v1/forms/xml`,
	FORM_DOWNLOAD_XLS: `${formBuilderHost}/FormBuilder/api/v1/forms/xls`,
	CDE_DOWNLOAD_XML: `${formBuilderHost}/FormBuilder/api/v1/cde/xml`,
	CDE_DOWNLOAD_XLS: `${formBuilderHost}/FormBuilder/api/v1/cde/xls`
};

/*Make immutable */
Object.freeze(ENDPOINT_URLS);

export default ENDPOINT_URLS;