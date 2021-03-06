import Marionette from "backbone.marionette";
import {Model, Collection} from "backbone";
import EVENTS from '../../constants/EVENTS';
import userService from  "../user/UserService";
import cartsService from  "../carts/CartsService";
import {browserHistory} from 'react-router';
import formActions from '../../constants/formActions';
import formHelpers from '../../helpers/formHelpers';
import {appChannel, formChannel} from '../../channels/radioChannels';
import FormModel from '../../models/forms/FormModel';
import backboneModelHelpers from '../../helpers/backboneModelHelpers';
import QuestionsModel from '../../models/forms/QuestionsModel';
import FormModuleModel from '../../models/forms/FormModuleModel';
import formUIStateModel from '../../models/forms/FormUIStateModel';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';
import {ajaxDownloadFile, fetchSecure} from '../../helpers/ajaXHelpers';
/**
 * This is a service that maintains the state of a form, modules, and questions. We may want to break out module-specific and question-specific functionality into their own modules
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */

const FormService = Marionette.Object.extend({
	channelName:   'form',
	radioRequests: {
		[EVENTS.FORM.ADD_MODULE_FROM_CART]:     'handleAddModuleFormCart',
		[EVENTS.FORM.CANCEL_EDIT_FORM]:         'handleCancelEditForm',
		[EVENTS.FORM.EDIT_FORM]:                'handleSetFormEditable',
		[EVENTS.FORM.GET_MODULE]:               'getModuleModel',
		[EVENTS.FORM.SET_FORM_LAYOUT]:          'handleFormActionModeChange',
		[EVENTS.FORM.CREATE_MODULE]:            'handleFormActionModeChange',
		[EVENTS.FORM.CREATE_QUESTION_FROM_CDE]: 'handleCreateQuestionFromCde',
		[EVENTS.FORM.SET_CORE_FORM_DETAILS]:    'handleFormMetadataSubmitData',
		[EVENTS.FORM.REMOVE_MODULE]:            'handleRemoveModule',
		[EVENTS.FORM.REMOVE_QUESTION]:          'handleRemoveQuestion',
		[EVENTS.FORM.REMOVE_VALID_VALUE]:       'handleRemoveValidValue',
		[EVENTS.FORM.SET_NEW_MODULE]:           'handleAddModule',
		[EVENTS.FORM.SET_MODULE]:               'handleSetModule',
		[EVENTS.FORM.SAVE_FORM]:                'handleSaveForm',
		[EVENTS.FORM.VIEW_MODULE]:              'setModuleView',
		[EVENTS.FORM.CREATE_COPY]:              'handleCreateCopy',
		[EVENTS.FORM.DELETE]:                   'handleDelete',
		[EVENTS.FORM.GET_DOWNLOAD_XLS]:         'handleDownloadXLS',
		[EVENTS.FORM.GET_DOWNLOAD_XML]:         'handleDownloadXML',
	},
	radioEvents:   {
		[EVENTS.FORM.SET_QUESTION]:    'handleSetModuleQuestion',
		[EVENTS.FORM.SET_VALID_VALUE]: 'handleSetModuleQuestionValidValue'

	},
	initialize() {
		this.setupModels();
		userService.getUserName().then((username) =>{
			this.currentUserName = (username) ? username : null;
		});
	},
	handleFormActionModeChange({action, formIdseq = this.formModel.get('formIdseq')}) {
		switch(action){
			case formActions.CREATE_FORM:
				this.formUIStateModel.set({actionMode: action});
				if(!this.formModel.isNew()){
					this.formModel = null;
					this.formModel = new FormModel();
				}
				break;
			case formActions.CREATE_MODULE:
				this.formUIStateModel.set({actionMode: action});
				break;
			case formActions.VIEW_MODULE:
				this.formUIStateModel.set({actionMode: action});
				break;
			case formActions.VIEW_QUESTION:
				this.formUIStateModel.set({actionMode: action});
				break;
			case formActions.VIEW_FORM_METADATA:
				this.formUIStateModel.set({actionMode: action});
				break;
			case formActions.VIEW_FULL_FORM:
				this.formUIStateModel.set({actionMode: action});
				this.getCartData({collectionName: "cdeCartCollection"});
				this.getCartData({collectionName: "moduleCartCollection"});
				break;
			default:
				console.error("no valid action provided");
		}
	},
	createForm() {
		/* TODO turn this into a promise like in saveForm() */
		this.formModel.get('formMetadata').save(null, {
			success: (model) =>{
				let formIdseq = model.get("formIdseq");
				this.formModel.set({
					formIdseq: formIdseq
				});
				/* Users creating the form should get curatorial rights to edit them*/
				this.formModel.get('formMetadata').set({curatorialPermission: true});

				browserHistory.push(`/FormBuilder/forms/${formIdseq}`);
				this.formUIStateModel.set({
					isEditing:            true,
					formIdSeqEditingForm: formIdseq
				});
				this.handleFormActionModeChange({action: formActions.VIEW_FULL_FORM});
			},
			error:   (response) =>{
				appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE, {
					message: "There was a problem creating the Form.  Please try again.",
					level:   "error"
				});
				console.log(response);
			}
		});
	},
	getCartData({collectionName}) {
		/*Only retrieve carts if user actually exists */
		userService.getUserName().then((username) =>{
			if(username){
				return cartsService.fetchCarts({collectionName, getCached: true}).then((cart)=>{
					this.formUIStateModel.set({cdeCartPopulated: true});
				});
			}
		});
	},
	/* TODO have other methods here use this method */
	getModuleModel(id) {
		return this.formModel.get('formModules').get(id);
	},
	getModuleQuestionModel({moduleId, questionId}) {
		const moduleModel = this.getModuleModel(moduleId);
		return moduleModel.get("questions").get(questionId);
	},
	handleAddModule(data) {
		const newModuleModel = this.formModel.get('formModules').add(new FormModuleModel(data));
		appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE, {
			message: "Module Added",
			level:   "success"
		});
		this.setModuleView(newModuleModel.cid);
	},
	handleAddModuleFormCart({moduleId}) {
		const questionModelFromCDECart = appChannel.request(EVENTS.CARTS.GET_MODULE_MODEL, moduleId);

		/*Make sure the new question model doesn't include any info from the one in the CDE cart
		 * http://stackoverflow.com/questions/15163952/how-to-clone-models-from-backbone-collection-to-another#answer-15165027 */
		const newModulePojo = backboneModelHelpers.getDeepModelPojo(_.omit(questionModelFromCDECart, "form"), false);
		/*TODO is this still needed? */
		if(newModulePojo.moduleIdseq !== undefined){
			delete newModulePojo.moduleIdseq;
		}

		/*Change the order of all existing modules, and mark them as isEdited: true */
		backboneModelHelpers.setCollectionModelsComparatorValue({
			collection:      this.formModel.get('formModules'),
			increment:       1,
			otherAttrsToSet: {
				isEdited: true
			}
		});
		/* set dispOrder as 0 in case it's something else */
		newModulePojo.dispOrder = 0;
		this.formModel.get('formModules').add(new FormModuleModel(newModulePojo));
	},
	handleCancelEditForm({action = this.formUIStateModel.attributes.actionMode}) {
		formHelpers.releaseForm({formIdseq: this.formModel.get('formIdseq')}).then((data) =>{
			if(data === true){
				this.formUIStateModel.set({
					actionMode:           action,
					isEditing:            false,
					formIdSeqEditingForm: null
				});
			}
		});

	},
	handleCreateQuestionFromCde({questionCid, activeModuleId} = {}) {
		this.formUIStateModel.set({isEditing: true});
		const moduleModel = this.getModuleModel(activeModuleId);
		const questionModelFromCDECart = appChannel.request(EVENTS.CARTS.GET_QUESTION_MODEL, questionCid);

		const newQuestionPojo = backboneModelHelpers.getDeepModelPojo(questionModelFromCDECart, false);
		/*Change the order of all existing questions, and mark them as isEdited: true */
		backboneModelHelpers.setCollectionModelsComparatorValue({
			collection:      moduleModel.get("questions"),
			increment:       1,
			otherAttrsToSet: {
				isEdited: true
			}
		});
		/* set displayOrder as 0 in case it's something else */
		newQuestionPojo.displayOrder = 0;
		moduleModel.get("questions").add(new QuestionsModel(newQuestionPojo));
	},
	handleRemoveModule({id}) {
		this.formModel.get("formModules").remove(id);
		if(this.formUIStateModel.attributes.actionMode === formActions.VIEW_MODULE){
			this.formUIStateModel.set({actionMode: formActions.VIEW_FULL_FORM});
		}
	},
	handleRemoveQuestion({moduleId, questionId}) {
		this.getModuleModel(moduleId).get("questions").remove(questionId);
	},
	handleRemoveValidValue({moduleId, questionId, validValueId}) {
		const questionModel = this.getModuleQuestionModel({
			moduleId:   moduleId,
			questionId: questionId
		});
		questionModel.get("validValues").remove(validValueId);
		/* Make FormLayout re-render because it's listening for update on this collection */
		questionModel.trigger("change");
	},
	handleSaveForm() {
		this.persistForm({successMessage: "Form Saved"});
	},
	handleSetFormEditable() {
		const formIdseq = this.formModel.get('formIdseq');
		formHelpers.setFormLocked({formIdseq: formIdseq}).then((data) =>{
			if(data === true){
				this.formUIStateModel.set({
					formIdSeqEditingForm: formIdseq,
					isEditing:            true
				});
			}
			else{
				/* Dirty hack: in order for FormLayout to re-render and show lock notification, we need to change an attribute in formUIStateModel, which FormLayout has set as state via BackboneReact, so it will re-render. formModel is not set as a state, so it won't re-render on that change alone */
				this.formUIStateModel.set({formIdSeqEditingForm: undefined});
				this.formModel.get('formMetadata').set({locked: true});
			}
		});
	},
	handleSetModule(data) {
		const module = this.getModuleModel(data.id);
		/* Removing the cid we used to track the module via the UI, so it doesn't get added as an attibute of the module when setting the rest of the data */
		const moduleAttributes = _.omit(data, "id");
		module.set(moduleAttributes);
		if(module.get("moduleIdseq") && !module.get("isEdited")){
			module.set("isEdited", true);
		}
	},
	handleSetModuleQuestion(data) {
		const questionModel = this.getModuleQuestionModel({moduleId: data.moduleId, questionId: data.questionId});
		/* Adding isEdited: true so BE knows question has chagned */
		const questionAttributes = (questionModel.isNew() ? data.questionData : Object.assign({}, data.questionData, {isEdited: true}));
		questionModel.set(questionAttributes);
		/*
		 console.log("question updated");
		 */
	},
	handleSetModuleQuestionValidValue(data) {
		const questionModel = this.getModuleQuestionModel({
			moduleId:   data.moduleId,
			questionId: data.questionId
		});
		const validValueModel = questionModel.get("validValues").get(data.validValueId);
		/* Adding isEdited: true so BE knows valid value has chagned */
		const validValueAttributes = (validValueModel.isNew() ? data.validValueData : Object.assign({}, data.validValueData, {isEdited: true}));
		validValueModel.set(validValueAttributes);
		/* Make FormLayout re-render because it's listening for update on this collection */
		questionModel.trigger("change");
	},
	persistForm({successMessage} = {}) {
		delete this.formModel.url;
		this.formModel.urlRoot = ENDPOINT_URLS.FORMS_DB;
		let moduleViewingId = this.formUIStateModel.attributes.moduleViewingId,
			indexOfModuleViewing;
		if(moduleViewingId){
			indexOfModuleViewing = this.formModel.get("formModules").indexOf(this.getModuleModel(moduleViewingId));
		}
		const p = new Promise(
			(resolve, reject) =>{
				this.formModel.save(null).then(() =>{
					resolve();
				}).catch((error) =>{
					reject(error);
				});
			}
		);
		return p.then(()=>{
			if(successMessage){
				appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE, {
					message: successMessage,
					level:   "success"
				});
			}
			const formModules = this.formModel.get("formModules");
			if(moduleViewingId){
				const moduleViewing = formModules.findWhere({dispOrder: indexOfModuleViewing});
				if(moduleViewing){
					this.setModuleView(moduleViewing.cid);
				}
				else{
					this.formUIStateModel.set({actionMode: formActions.VIEW_FULL_FORM});
				}
			}
		}).catch((error)=>{
			appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE, {
				message: "There was a problem saving the form.  Please try again",
				level:   "error"
			});
			console.log(error);
		});
	},
	saveWorkingCopyForm() {
		const saveOptions = {
			dataType: 'text',
			method:   'post'};
		this.formModel.url = ENDPOINT_URLS.FORMS_WORKING_COPY;
		return new Promise(
			(resolve, reject) =>{
				this.formModel.save(null, saveOptions)
					.then(() =>{
						resolve();
					}).catch((error) =>{
					reject(error);
					appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE, {
						message: "The Working copy of the form you were editing could not be saved.",
						level:   "error"
					});
				});
			}
		);
	},
	setModuleView(id) {
		/*TODO: Prepare for when editing a module with repetitions, this will be an array containing the module and its associated repetitioned modules */
		this.formUIStateModel.set({moduleViewingId: id});
		this.handleFormActionModeChange({action: formActions.VIEW_MODULE});
		formChannel.trigger(EVENTS.FORM.SET_MODULE_TO_VIEW);
	},
	handleFormMetadataSubmitData(data) {
		this.formModel.get('formMetadata').set(data);

		/* POST form if if we're in create form, otherwise we don't need to do anything else*/
		if(this.formUIStateModel.attributes.actionMode === formActions.CREATE_FORM){
			this.formModel.get('formMetadata').set({
				createdBy: this.currentUserName
			});
			this.createForm();
		}
	},
	setForm({model: model, setEditing = false}) {
		this.formModel = model;
		if(setEditing !== this.formUIStateModel.attributes.isEditing){
			this.formUIStateModel.set({
				isEditing: setEditing
			});
		}
	},
	setupModels() {
		this.formModel = new FormModel();
		this.formUIStateModel = formUIStateModel;
	},
	handleCreateCopy(formIdseq) {
		fetchSecure({
			url:           `${ENDPOINT_URLS.FORMS.CREATE_COPY}/${formIdseq}`,
			method:        "POST",
			dataType:      "text",
			swallowErrors: false,
		}).then((data) =>{
			data.text().then((text) =>{
				appChannel.request(EVENTS.APP.SHOW_USER_MODAL_MESSAGE, {
					heading: "FORM SUCCESSFULLY COPIED",
					message: "You will now be redirected to the copied version of the form.  A new public ID has been assigned.",
					button:  {
						label:    "VIEW COPIED FORM",
						callback: () =>{
							let url = "/FormBuilder/forms/" + text;
							window.location.href = url;
						}
					}
				});
			});
		}).catch(() =>{
			appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE, {
				message: "FORM FAILED TO COPY",
				level:   "error"
			});
		});
	},
	handleDelete(formIdseq) {
		fetchSecure({
			url:           `${ENDPOINT_URLS.FORMS.DELETE}/${formIdseq}`,
			method:        "DELETE",
			swallowErrors: false,
			dataType:      "string"
		}).then((data) =>{
			appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE, {
				message: "FORM SUCCESSFULLY DELETED",
				level:   "success"
			});
			setTimeout(function(){
				window.location.href = "/FormBuilder/";
			}, 2000);
		}).catch((msg) =>{
			appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE, {
				message: "FORM DELETION FAILED",
				level:   "error"
			});
			console.log(msg);
		});
	},
	handleDownloadXML(formIdseq) {
		ajaxDownloadFile(`${ENDPOINT_URLS.FORMS.GET_DOWNLOAD_XML}/${formIdseq}`, 'xml');
	},
	handleDownloadXLS(formIdseq) {
		ajaxDownloadFile(`${ENDPOINT_URLS.FORMS.GET_DOWNLOAD_XLS}/${formIdseq}`, 'xls');
	}
});
const formService = new FormService();
export default formService;