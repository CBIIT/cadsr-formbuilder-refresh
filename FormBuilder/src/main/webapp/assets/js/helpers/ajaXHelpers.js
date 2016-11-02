/**
 * Download a file via ajax
 * http://stackoverflow.com/questions/34586671/download-pdf-file-using-jquery-ajax#answer-34587987
 * @param url
 * @param fileExtension
 */
export const ajaxDownloadFile = (url, fileExtension) =>{
	const req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.responseType = "blob";

	req.onload = function(event){
		const blob = req.response;
		createDownloadLink(blob, fileExtension);
	};
	req.send();
};

/**
 * Create a temporary link that when clicked, induces the browser to download a blob
 * @param data
 * @param fileExtension
 */
export const createDownloadLink = (data, fileExtension) =>{
	const blob = new Blob([data], {type: 'text/csv'});
	if(typeof window.navigator.msSaveBlob !== 'undefined'){
		// IE workaround for "HTML7007: One or more blob URLs were
		// revoked by closing the blob for which they were created.
		// These URLs will no longer resolve as the data backing
		// the URL has been freed."
		window.navigator.msSaveBlob(blob, `file.${fileExtension}`);
	}
	else{
		const url = window.URL.createObjectURL(blob);
		const tempLink = document.createElement('a');
		tempLink.href = url;
		tempLink.setAttribute('download', `file.${fileExtension}`);
		tempLink.setAttribute('target', '_blank');
		document.body.appendChild(tempLink);
		tempLink.click();
		document.body.removeChild(tempLink);
	}
};

/**
 * Translates the body of the response into JSON.  Performs no error checking on the
 * translation process so, if the response MAY not contain json, the developer is
 * encouraged to perform this step within his/her own handler.
 * 
 * @returns {Promise} with the json data in the body
 */
export const getResponseAsJSON = (response) => {
	return response.text().then((text) => {
		let body = null;
		if (text.length > 0) {
			body = JSON.parse(text);
		}
		return Promise.resolve(body);
	});
};

/**
 * Checks the response for an error code.  If the code is in the 200s, resolves
 * the promise back to the stack.  If not, rejects the promise with an Error of the
 * status.
 * 
 * @returns {Promise} with the Reponse in the body or Error upon rejection
 */
export const rejectErrors = (response) => {
	return new Promise((resolve, reject) => {
		if(response.status >= 200 && response.status < 300){
			return Promise.resolve(response);
		} else{
			return Promise.reject(new Error(response.statusText));
		}
	});
};

/**
 * Fetch and return resource using the Fetch API with {credentials: 'same-origin'} header.
 * See https://developers.google.com/web/updates/2015/03/introduction-to-fetch
 * @param url
 * @returns {Promise} Response from the fetch
 */
export const fetchRequestData = (url, method, contentType, data) => {
	return fetch(url, {
		method:      method,
		credentials: 'include',
		headers:     {
			"Content-type": contentType
		},
		body:        data
	});
};

/**
 * Generalizing method for performing an ajax request and processing the results.
 * Optionally runs the Response from a fetch through the rejectErrors and
 * getResponseAsJSON methods to transform the Promise as needed.
 * 
 * @param url - URL to send the request to
 * @param method - request method name.  default: GET
 * @param data - POST data to send to the server.  default: null
 * @param contentType - content type of the request to the server.  default: application/json
 * @param swallowErrors - whether to run the Response through rejectErrors() or not.  Default true
 * @param dataType - type of the response from the server.  Default: "json".  If "json", runs the Response through getResponseAsJSON()
 * @returns {Promise}
 * 
 * @Note The support functions rejectErrors and getResponseAsJSON can be used
 * by the developer independently of this method.  This is especially useful if
 * non-standard conditions exist where the user needs to perform some step BEFORE
 * these run.
 * The syntax would be something like: 
 * fetchSecure(...).then((response) =>{ your code here}).then(getResponseAsJSON)
 */
export const fetchSecure = ({url, method = 'get', data = null, contentType = 'application/json', swallowErrors = true, dataType = 'json'}) =>{
	let promiz = fetchRequestData(url, method, contentType, data);
	if (swallowErrors) {
		promiz = promiz.then(rejectErrors);
	}
	if (dataType == 'json') {
		promiz = promiz.then(getResponseAsJSON);
	}
	
	return promiz;
};
