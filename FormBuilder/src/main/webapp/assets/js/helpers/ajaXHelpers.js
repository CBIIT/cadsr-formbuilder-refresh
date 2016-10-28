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
 * Fetch and return resource using the Fetch API with {credentials: 'same-origin'} header.
 * See https://developers.google.com/web/updates/2015/03/introduction-to-fetch
 * @param url
 * @returns {Promise}
 */
export const fetchSecure = ({url}) =>{
	function getResponseStatus(response){
		if(response.status >= 200 && response.status < 300){
			return Promise.resolve(response);
		} else{
			return Promise.reject(new Error(response.statusText));
		}
	}

	function getResponseAsJSON(response){
		return response.json();
	}

	return new Promise(
		(resolve) =>{
			fetch(url, {credentials: 'same-origin'})
				.then(getResponseStatus)
				.then(getResponseAsJSON)
				.then(function(data){
					resolve(data);
				}).catch(function(error){
				console.log('Request failed', error);
			});
		}
	);
};