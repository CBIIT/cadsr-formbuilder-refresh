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
		const setFormLayout = () =>{
			formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {
				action:    formActions.VIEW_FULL_FORM,
				formIdseq: nextState.params.formIdseq
			});
		};

		let setFormEditing = false;
		/* If the form is different than the one they previously viewed, or it's the first form they're viewing, fetch the form */
		if(formService.formModel && (formIdseqCurrentForm !== formIdseqFormToView)){
			const networkOperations = [];
			const newFormModel = new FormModel();
			const formIdSeqEditingForm = formService.formUIStateModel.attributes.formIdSeqEditingForm;

			/* Save the working copy of the form the user was editing and return a promise*/
			const saveWorkingCopyForm = () =>{
				return formService.saveWorkingCopyForm().then(() =>{
					return Promise.resolve();
				});
			};
			/* Fetch the form the user wants to see and return a promise*/
			const fetchForm = () =>{
				return newFormModel.fetch().then(()=>{
					return Promise.resolve(newFormModel);
				}).catch(error =>{
					return Promise.reject(error);
				});
			};

			newFormModel.set("formIdseq", nextState.params.formIdseq);
			if((formIdSeqEditingForm !== null && formIdSeqEditingForm !== formIdseqFormToView) && formIdseqCurrentForm){
				networkOperations.push(saveWorkingCopyForm());
			}
			else if(formIdSeqEditingForm === formIdseqFormToView){
				setFormEditing = true;
			}

			networkOperations.push(fetchForm());
			/*Wait until all operations are complete*/

			Promise.all(networkOperations).then((results) =>{
				setFormLayout();
				callback();
				const fetchedFormModel = results[results.length - 1];
				formService.setForm({model: fetchedFormModel, setEditing: setFormEditing});
			})
				.catch(function(error){
					// One or more promises was rejected
				});
		}
		/*It's the first form the user is viewing */
		else{
			setFormLayout();
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