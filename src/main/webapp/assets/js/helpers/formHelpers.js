import FormModel from '../models/forms/FormModel';
import {fetchSecure} from './ajaXHelpers';
import ENDPOINT_URLS from '../constants/ENDPOINT_URLS';
import formService from  "../services/form/FormService";
import userMessagesText from '../constants/userMessagesText';
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
			/* An array of promises passed into promise.all*/
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
			const fetchForm = ({getWorkingCopy = false, errorMessage = userMessagesText.FETCH_FORM_FAIL} ={}) =>{
				if(getWorkingCopy){
					newFormModel.url = ENDPOINT_URLS.FORMS_WORKING_COPY;
				}
				else if(!getWorkingCopy && newFormModel.url){
					/*If the model has a hardcoded url (endpoint to working copy), remove it and set it to be dynamic (its ID appended to urlRoot))*/
					delete newFormModel.url;
					newFormModel.urlRoot = ENDPOINT_URLS.FORMS_DB;
				}
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
				networkOperations.push(saveWorkingCopyForm());
				networkOperations.push(fetchForm());
			}
			/*They're going to view the SAME form they were editing */
			else if(formIdSeqEditingForm === formIdseqFormToView){
				networkOperations.push(fetchForm({
					getWorkingCopy: true,
					errorMessage:   userMessagesText.FETCH_WORKING_COPY_FAIL
				}));
				setFormEditing = true;
			}
			else{
				networkOperations.push(fetchForm());
			}
			/*Wait until all networkOperations promises are complete*/
			Promise.all(networkOperations).then((results) =>{
				/* Get the fetchedFormModel from the array of promises */
				const fetchedFormModel = _.find(results, (item) => {
					return item instanceof Backbone.Model;
				});
				formService.setForm({model: fetchedFormModel, setEditing: setFormEditing});
				setFormLayout();
				callback();

			}).catch(function(error){
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
				}).then((data) => (resolve(data))).catch((msg) =>{
						appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE, {
							message: userMessagesText.SET_FORM_LOCK_FAIL,
							level:   "error",
							autoDismiss: false
						});
						console.log(msg);
					});
			});
	},
	releaseForm({formIdseq}) {
		fetchSecure({url: ENDPOINT_URLS.FORMS_WORKING_COPY, method: "delete"});

		return new Promise(
			(resolve) =>{
				fetchSecure({
					url:    `${ENDPOINT_URLS.FORMS.LOCK}/${formIdseq}`,
					method: 'delete'
				}).then((data) => (resolve(data))).catch((msg) =>{
					appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE, {
						message: userMessagesText.RELEASE_FORM_LOCK_FAIL,
						level:   "error",
						autoDismiss: false
					});
					console.log(msg);
				});
			});
	}
};

export default formHelpers;