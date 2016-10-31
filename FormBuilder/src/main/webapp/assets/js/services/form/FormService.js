import Marionette from "backbone.marionette";
import {Model, Collection} from "backbone";
import EVENTS from '../../constants/EVENTS';
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
import {ajaxDownloadFile} from '../../helpers/ajaXHelpers';
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
		[EVENTS.FORM.SET_FORM_LAYOUT]:          'dispatchLayout',
		[EVENTS.FORM.CREATE_MODULE]:            'dispatchLayout',
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
	},
	dispatchLayout({action, formIdseq = this.formModel.get('formIdseq')}) {
		switch(action){
			case formActions.CREATE_FORM:
				this.formUIStateModel.set({actionMode: action});
				if(!this.formModel.isNew()){
					delete this.formModel;
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
				if(formIdseq !== this.formModel.get('formIdseq')){
					/* IF going to view a different form, make sure edit controls are turned off */
					this.formUIStateModel.set({isEditing: false});
				}
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
				browserHistory.push(`/FormBuilder/`);
				this.formUIStateModel.set({isEditing: true});
				this.dispatchLayout({action: formActions.VIEW_FULL_FORM});
				//				alert("Form created. formIdseq is: " + formIdseq);
			},
			error:   (model, response) =>{
				/*TODO: of course this is too basic. Improve error handling */
				alert("error");
			}
		});
	},
	getCartData({collectionName}) {
		/*Only retrieve carts if user actually exists */
		if(appChannel.request(EVENTS.USER.GET_USERNAME)){
			return cartsService.fetchCarts({collectionName, getCached: true}).then((cart)=>{
				this.formUIStateModel.set({cdeCartPopulated: true});
			});
		}
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
		this.saveForm().then(() =>{
			alert("Module Added");
			/* TODO Hack for CADSRFBTR-282. make sure to remove when redesigning form saving */
			newModuleModel.set("moduleIdseq", this.formModel.get("tempNewModuleseqId"));
			this.formModel.unset("tempNewModuleseqId");
			/* End Hack*/
			this.setModuleView(newModuleModel.cid);
		});
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
		formHelpers.unlockForm({formIdseq: this.formModel.get('formIdseq')}).then((data) =>{
			if (data === true) {
				this.formUIStateModel.set({
					actionMode: action,
					isEditing:  false
				});
			}
		});

	},
	handleCreateQuestionFromCde({questionCid, activeModuleId} = {}) {
		this.formUIStateModel.set({isEditing: true});
		const moduleModel = this.getModuleModel(activeModuleId);
		const questionModelFromCDECart = appChannel.request(EVENTS.CARTS.GET_QUESTION_MODEL, questionCid);

		const newQuestionPojo = backboneModelHelpers.getDeepModelPojo(questionModelFromCDECart, false);
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
	handleRemoveValidValue({moduleId,questionId,validValueId}) {
		this.getModuleQuestionModel({
			moduleId:   moduleId,
			questionId:questionId
		}).get("validValues").remove(validValueId);
	},
	handleSaveForm() {
		this.saveForm({successMessage: "Entire form saved to DB. This is what \"Global Save\" will do."});
	},
	handleSetFormEditable() {
		formHelpers.setFormLocked({formIdseq: this.formModel.get('formIdseq')}).then((data) =>{
			if (data === true) {
				this.formUIStateModel.set({isEditing: true});
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
		console.log("module saved");
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
		const validValueModel = this.getModuleQuestionModel({
			moduleId:   data.moduleId,
			questionId: data.questionId
		}).get("validValues").get(data.validValueId);
		/* Adding isEdited: true so BE knows valid value has chagned */
		const validValueAttributes = (validValueModel.isNew() ? data.validValueData : Object.assign({}, data.validValueData, {isEdited: true}));
		validValueModel.set(validValueAttributes);
		/*
		 console.log("valid value updated");
		 */
	},
	saveForm({persistToDB = false, successMessage} = {}) {
		const p = new Promise(
			(resolve, reject) =>{
				this.formModel.save(null, {
					dataType: 'text'
				}).then(() =>{
					resolve();
				}).catch((error) =>{
					reject(error);
				});
			}
		);
		return p.then(()=>{
			if(successMessage) alert(successMessage);
		}).catch((error)=>{
			alert("error");
			console.log(error);
		});
	},
	setModuleView(id) {
		/*TODO: Prepare for when editing a module with repetitions, this will be an array containing the module and its associated repetitioned modules */
		this.formUIStateModel.set({moduleViewingId: id});
		this.dispatchLayout({action: formActions.VIEW_MODULE});
	},
	handleFormMetadataSubmitData(data) {
		/*TODO handle context a better way. */
		let context = data.conteIdseq;
		delete data.conteIdseq;

		this.formModel.get('formMetadata').set(data);
		this.formModel.get('formMetadata').set({
			context: {conteIdseq: context}
		});
		if(this.formModel.isNew()){
			this.formModel.get('formMetadata').set({
				createdBy: appChannel.request(EVENTS.USER.GET_USERNAME)
			});
			this.createForm();
		}
		else{
			this.saveForm({successMessage: "Entire form saved to DB. This is what \"Global Save\" will do."});
		}
	},
	setForm(model) {
		this.formModel = model;
	},
	setupModels() {
		this.formModel = new FormModel();
		this.formUIStateModel = formUIStateModel;
	},
	handleCreateCopy({formIdseq}) {
		$.ajax({
			url: `${ENDPOINT_URLS.FORMS.CREATE_COPY}/${formIdseq}`,
			method: "GET"
		})
		.done(function(data) {
			alert("Form Successfully Copied\nYou will now be redirected to the copied version of the form.  A new public ID has been assigned.");
			this.dispatchLayout({action: formActions.VIEW_FULL_FORM, formIdseq: data});
		})
		.fail(function() {
			alert("The Form was not successfully copied");
		});
	},
	handleDelete({formIdseq}) {
		$.ajax({
			url: `${ENDPOINT_URLS.FORMS.DELETE}/${formIdseq}`,
			method: "DELETE"
		})
		.done(function(data) {
			browserHistory.push(`/FormBuilder/`);
		})
		.fail(function() {
			alert("The Form failed to delete properly");
		});
	},
	handleDownloadXML({formIdseq}) {
		ajaxDownloadFile(`${ENDPOINT_URLS.FORMS.GET_DOWNLOAD_XML}/${formIdseq}`, 'xml');
	},
	handleDownloadXLS({formIdseq}) {
		ajaxDownloadFile(`${ENDPOINT_URLS.FORMS.GET_DOWNLOAD_XLS}/${formIdseq}`, 'xls');
	}
});
const formService = new FormService();
export default formService;