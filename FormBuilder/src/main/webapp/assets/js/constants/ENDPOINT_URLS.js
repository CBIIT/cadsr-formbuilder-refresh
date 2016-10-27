/* serverProps is a global var declared in index.jsp */
const formBuilderHost = serverProps.formBuilderHost;
const formBuilderApiEndpointBaseUrl = `${formBuilderHost}/FormBuilder/api/v1`;
const ENDPOINT_URLS = {
	CATEGORIES:          `${formBuilderApiEndpointBaseUrl}/categories`,
	CONTEXTS:            `${formBuilderApiEndpointBaseUrl}/contexts`,
	FORMS_DB:            `${formBuilderApiEndpointBaseUrl}/forms`,
	FORMS_WORKING_COPY:           `${formBuilderApiEndpointBaseUrl}/forms/workingCopy`,
	TYPES:                        `${formBuilderApiEndpointBaseUrl}/types`,
	WORKFLOWS:                    `${formBuilderApiEndpointBaseUrl}/workflows`,
	CDE_CART_FETCH:               `${formBuilderApiEndpointBaseUrl}/carts/cdecart`,
	CDE_CART_PERSIST:             `${formBuilderApiEndpointBaseUrl}//carts/cdes`,
	MODULE_CART_FETCH:            `${formBuilderApiEndpointBaseUrl}/carts/modulecart`,
	MODULE_CART_PERSIST:          `${formBuilderApiEndpointBaseUrl}/carts/modules`,
	FORM_CART_FETCH:              `${formBuilderApiEndpointBaseUrl}/carts/formcart`,
	FORM_CART_PERSIST:              `${formBuilderApiEndpointBaseUrl}/carts/forms`,
	/*GET: /carts/forms/{formIdseq}
	 Persists any Form out to the object cart service.
	 Distinct from saving to in-session Form Cart
	 Reason this is a get, is because it does not need a a request body, we retrieve the full form from the back end database by way of the formIdseq
	 */
	FORM_CART_PERSIST_OBJECTCART: `${formBuilderApiEndpointBaseUrl}/carts/forms`,
	FORM_DOWNLOAD_XML:            `${formBuilderApiEndpointBaseUrl}/forms/xml`,
	FORM_DOWNLOAD_XLS:            `${formBuilderApiEndpointBaseUrl}/forms/xls`,
	CDE_DOWNLOAD_XML:             `${formBuilderApiEndpointBaseUrl}/cde/xml`,
	CDE_DOWNLOAD_XLS:             `${formBuilderApiEndpointBaseUrl}/cde/xls`,
	PROTOCOLS:                    `${formBuilderApiEndpointBaseUrl}/protocols`,
	CLASSIFICATIONS:              `${formBuilderApiEndpointBaseUrl}/classifications`,
};

/*Make immutable */
Object.freeze(ENDPOINT_URLS);

export default ENDPOINT_URLS;