import ENDPOINT_URLS from '../constants/ENDPOINT_URLS';
import {formChannel} from '../channels/radioChannels';
import EVENTS from '../constants/EVENTS';

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

	let promises = urls.map(url => fetch(url, {credentials:'same-origin'}).then(response => response.json()));
	Promise.all(promises).then(results => {
		const formMetaDataDropdownOptions = {
			contexts: results[0],
			categories: results[1],
			types: results[2],
			workflows: results[3]
		};

		formChannel.trigger(EVENTS.FORM.GET_FORM_CORE_DETAILS_CRITERIA, formMetaDataDropdownOptions);
	});
};
