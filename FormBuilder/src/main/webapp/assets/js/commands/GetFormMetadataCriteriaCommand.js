import ENDPOINT_URLS from '../constants/ENDPOINT_URLS';
/**
 * fetch data that populates dropdown options
 * @param userName
 * @constructor
 */
export const GetFormMetadataCriteriaInputOptions = function({userName = "user"} = {}){

	const urls = [
		/* Supplying any string to /contexts/{anystring} will get the current user's context list, so the specific username isn't needed */
		`${ENDPOINT_URLS.CONTEXTS}/${userName}`,
		ENDPOINT_URLS.CATEGORIES,
		ENDPOINT_URLS.TYPES,
		ENDPOINT_URLS.WORKFLOWS];

	return new Promise(
		(resolve) =>{
			let promises = urls.map(url => fetch(url, {credentials: 'same-origin'}).then(response => response.json()));
			Promise.all(promises).then(results =>{
				resolve({
					contexts:   results[0],
					categories: results[1],
					types:      results[2],
					workflows:  results[3]
				});
			});
		}
	);
};
