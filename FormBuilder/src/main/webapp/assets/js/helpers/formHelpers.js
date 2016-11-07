import FormModel from '../models/forms/FormModel';
import {fetchSecure} from './ajaXHelpers';
import ENDPOINT_URLS from '../constants/ENDPOINT_URLS';
import formService from  "../services/form/FormService";
import formActions from '../constants/formActions';
import {appChannel, formChannel} from '../channels/radioChannels';
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
			const fetchForm = ({errorMessage = "There was a problem trying to get the form you're trying to view."} ={}) =>{
				return newFormModel.fetch().then(()=>{
					return Promise.resolve(newFormModel);
				}).catch(error =>{
					appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE, {
						message: errorMessage,
						level:   "error"
					});
					return Promise.reject(error);
				});
			};
			newFormModel.set("formIdseq", nextState.params.formIdseq);

			/*They're going to view a DIFFERENT form then the one they're editing */
			if((formIdSeqEditingForm !== null && formIdSeqEditingForm !== formIdseqFormToView) && formIdseqCurrentForm){
				newFormModel.urlRoot = ENDPOINT_URLS.FORMS_DB;
				networkOperations.push(saveWorkingCopyForm());
				networkOperations.push(fetchForm());
			}
			/*They're going to view the SAME form they were editing */
			else if(formIdSeqEditingForm === formIdseqFormToView){
				newFormModel.url = ENDPOINT_URLS.FORMS_WORKING_COPY;
				networkOperations.push(fetchForm({errorMessage: "There was a problem trying to get the working copy of the form you were last editing."}));
				setFormEditing = true;
			}
			else{
				networkOperations.push(fetchForm());

			}
			/*Wait until all networkOperations promises are complete*/
			Promise.all(networkOperations).then((results) =>{
				setFormLayout();
				callback();
				/* Get the fetchedFormModel from the array of promises */
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
		fetchSecure({url: ENDPOINT_URLS.FORMS_WORKING_COPY, method: "delete"});

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