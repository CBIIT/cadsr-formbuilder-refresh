import FormModel from '../models/forms/FormModel';
import {fetchSecure} from './ajaXHelpers';
import ENDPOINT_URLS from '../constants/ENDPOINT_URLS';
import formService from  "../services/form/FormService";
import formActions from '../constants/formActions';
import {cartChannel, formChannel} from '../channels/radioChannels';
import EVENTS from '../constants/EVENTS';
const formHelpers = {
	fetchForm(nextState, replace, callback) {
		let formModel = new FormModel();
		formModel.set("formIdseq", nextState.params.formIdseq);
		formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {action: formActions.VIEW_FULL_FORM, formIdseq: nextState.params.formIdseq});
		formModel.fetch().then(() =>{
			formService.setForm(formModel);
			callback();
		}).catch(error =>{
			// do some error handling here
			callback(error);
		});
	},
	getFormLockStatus() {
		fetchSecure({url:ENDPOINT_URLS.FORMS.FORMS}).then((data) => data);
	}
};

export default formHelpers;