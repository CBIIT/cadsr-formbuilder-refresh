import FormModel from '../models/forms/FormModel';
import {fetchSecure} from './ajaXHelpers';
import ENDPOINT_URLS from '../constants/ENDPOINT_URLS';
import formService from  "../services/form/FormService";
import formActions from '../constants/formActions';
import {cartChannel, formChannel} from '../channels/radioChannels';
import EVENTS from '../constants/EVENTS';
const formHelpers = {
	fetchForm(nextState, replace, callback) {
		const formIdseqFormToView = nextState.params.formIdseq;
		const formIdseqCurrentForm = formService.formModel.attributes.formIdseq;

		let setFormEditing = false;
		/* If the form is different than the one they previously viewed, or it's the first form they're viewing, fetch the form */
		if(formService.formModel && (formIdseqCurrentForm !== formIdseqFormToView)) {
			const newFormModel = new FormModel();
			const formIdSeqEditingForm = formService.formUIStateModel.attributes.formIdSeqEditingForm;
			newFormModel.set("formIdseq", nextState.params.formIdseq);
			if((formIdSeqEditingForm !== null && formIdSeqEditingForm !== formIdseqFormToView) && formIdseqCurrentForm) {
				formService.saveWorkingCopyForm();
			}
			else if (formIdSeqEditingForm === formIdseqFormToView) {
				setFormEditing = true;
			}
			formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {
				action: formActions.VIEW_FULL_FORM,
				formIdseq: nextState.params.formIdseq
			});
			newFormModel.fetch().then(() =>{
				formService.setForm({model: newFormModel, setEditing: setFormEditing});
				callback();
			}).catch(error =>{
				// do some error handling here
				callback(error);
			});
		}
		/*It's the first form the user is viewing */
		else {
			formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {
				action: formActions.VIEW_FULL_FORM,
				formIdseq: nextState.params.formIdseq
			});
			callback();
		}
	},
	getFormLockStatus() {
		fetchSecure({url: ENDPOINT_URLS.FORMS.FORMS}).then((data) => data);
	},
	setFormLocked({formIdseq}) {
		return new Promise(
			(resolve) =>{
				fetchSecure({
					url:    `${ENDPOINT_URLS.FORMS.LOCK}/${formIdseq}`,
					method: 'post'
				}).then((data) => (resolve(data)));
			});
	},
	releaseForm({formIdseq}) {
		return new Promise(
			(resolve) =>{
				fetchSecure({
					url:    `${ENDPOINT_URLS.FORMS.LOCK}/${formIdseq}`,
					method: 'delete'
				}).then((data) => (resolve(data)));
			});
	}
};

export default formHelpers;