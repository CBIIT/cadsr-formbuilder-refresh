import Marionette from "backbone.marionette";
import {Model, Collection} from "backbone";
import React from 'react';
import {render} from 'react-dom';
import EVENTS from '../../constants/EVENTS';
import ROUTES from '../../constants/ROUTES';
import formActions from '../../constants/formActions';
import {formChannel, appChannel} from '../../channels/radioChannels';
import FormModel from '../../models/forms/FormModel';
import FormModuleModel from '../../models/forms/FormModuleModel';
import formUIStateModel from '../../models/forms/FormUIStateModel';
import formRouter from  "../../routers/FormRouter";
import DropDownOptionsCollection from '../../models/forms/DropDownOptionsCollection';
import GetFormMetadataCriteriaCommand from '../../commands/GetFormMetadataCriteriaCommand';
import FormLayout from '../../components/form/FormLayout';

/**
 * This is a service that maintains the state of a form, modules, and questions. We may want to break out module-specific and question-specific functionality into their own modules
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */

const FormService = Marionette.Object.extend({
	channelName:   'form',
	radioRequests: {
		[EVENTS.FORM.GET_CART_LIST]:         'getCartData',
		[EVENTS.FORM.CANCEL_EDIT_FORM]:      'handleCancelEditForm',
		[EVENTS.FORM.EDIT_FORM]:             'handleSetFormEditable',
		[EVENTS.FORM.SET_FORM_LAYOUT]:       'dispatchLayout',
		[EVENTS.FORM.CREATE_MODULE]:         'dispatchLayout',
		[EVENTS.FORM.SET_CORE_FORM_DETAILS]: 'handleFormMetadataSubmitData',
		[EVENTS.FORM.SET_NEW_MODULE]:        'handleAddModule',
		[EVENTS.FORM.SET_MODULE]:            'handleSetModule',
		[EVENTS.FORM.SAVE_FORM]:             'handleSaveForm',
		[EVENTS.FORM.VIEW_MODULE]:           'setModuleView'
	},
	radioEvents: {
		[EVENTS.FORM.SET_QUESTION]:      'handleSetModuleQuestion'
	},
	/* Stores cart data retrieved from carService */
	carts:         null,
	initialize({app}) {
		this.app = app;
		this.setupModels();
	},
	dispatchLayout({action, formIdseq = this.formModel.get('formIdseq')}) {
		switch(action){
			case formActions.CREATE_FORM:
				this.formUIStateModel.set({actionMode: action});
				formRouter.navigate(ROUTES.FORM.CREATE_FORM, {trigger: true});
				if(!this.formModel.isNew()){
					delete this.formModel;
					this.formModel = new FormModel();
				}
				this.fetchFormMetaDataCriteria();
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
				this.fetchFormMetaDataCriteria();
				break;
			case formActions.VIEW_FULL_FORM:
				this.formUIStateModel.set({actionMode: action});
				if(formIdseq !== this.formModel.get('formIdseq')){
					/* IF going to view a different form, make sure edit controls are turned off */
					this.formUIStateModel.set({isEditing: false});
					this.fetchForm({formIdseq: formIdseq});
				}
				this.getCartData({name: "cdeCartCollection"});
				break;
			default:
				console.error("no valid action provided");
		}
	},
	constructLayout(){
		/*Entry point for React. Backbone Views Keep Out.
		Once React is the top level view currently handled by Marionette (i.e.  AppLayoutView,js), we can render FormLayout from there instead   */
		render(
			<FormLayout formIdseq={this.formModel.attributes.formIdseq} formMetadata={this.formModel.attributes.formMetadata.attributes} formModules={this.formModel.attributes.formModules} cdeCartCollection={this.app.cartsService.cdeCartCollection} uiDropDownOptionsModel={this.uiDropDownOptionsModel.toJSON()} formUIState={this.formUIStateModel}/>, document.getElementById('main'));

	},
	createForm() {
		/* TODO turn this into a promise like in saveForm() */
		this.formModel.get('formMetadata').save(null, {
			success: (model) =>{
				let formIdseq = model.get("formIdseq");
				this.formModel.set({
					formIdseq: formIdseq
				});
				formRouter.navigate(`forms/${formIdseq}`, {trigger: false});
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
	fetchForm({formIdseq}) {
		this.formModel.set({formIdseq: formIdseq});
		/*TODO add catch() for error handling */
		this.formModel.fetch().then(() =>{
			this.constructLayout();
		});
	},
	getCartData({name}) {

		/*Only retrieve carts if user actually exists */
		if(appChannel.request(EVENTS.USER.GET_USERNAME)){
			return this.app.cartsService.fetchCarts({name}).then((cart)=>{
				this.formUIStateModel.set({cdeCartPopulated: true});
			});
		}
	},
	fetchFormMetaDataCriteria() {
		formChannel.on(EVENTS.FORM.GET_FORM_CORE_DETAILS_CRITERIA, () =>{
			this.constructLayout();
		});

		new GetFormMetadataCriteriaCommand({
			model:    this.uiDropDownOptionsModel,
			userName: appChannel.request(EVENTS.USER.GET_USERNAME)
		}).execute();
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
	handleCancelEditForm({action = this.formUIStateModel.attributes.actionMode}) {
		this.formUIStateModel.set({
			actionMode: action,
			isEditing:  false
		});
	},
	handleSaveForm() {
		this.saveForm({successMessage: "Form Saved"});
	},
	handleSetFormEditable() {
		/*Auth and permssions checks for for editing a form can go here*/
		this.formUIStateModel.set({isEditing: true});
	},
	handleSetModule(data) {
		const module = this.formModel.get('formModules').get(data.id);
		/* Removing the cid we used to track the module via the UI, so it doesn't get added as an attibute of the module when setting the rest of the data */
		const moduleAttributes = _.omit(data, "id");
		module.set(moduleAttributes);
		if(module.get("moduleIdseq") && !module.get("isEdited")){
			module.set("isEdited", true);
		}
		console.log("module saved");
/*
		this.saveForm({successMessage: "Module Saved"});
*/
	},
	handleSetModuleQuestion({moduleId, questionId, questionData}) {
		const moduleModel = this.formModel.get('formModules').get(moduleId);
		const questionModel  = moduleModel.get("questions").get(questionId);
		questionModel.set({questionData});
		console.log("question updated");

	},
	saveForm({persistToDB = false, successMessage} = {}) {
		const p = new Promise(
			(resolve, reject) =>{
				this.formModel.save(null, {
					dataType: 'text'
				}).then(() =>{
					resolve();
				}).catch((error) =>{
					alert("error");
					console.log(error);
				});
			}
		);
		return p.then(()=>{
			if(successMessage) alert(successMessage);
		}).catch((error)=>{
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
			this.saveForm({successMessage: "Form Details Saved"});
		}

	},
	setupModels() {
		this[name] = new Collection();

		/* Should only contain data to populate the form UI's immutable data */
		const UIDropDownOptionsModel = Model.extend({
			defaults: {
				contexts:       new DropDownOptionsCollection(),
				formCategories: new DropDownOptionsCollection(),
				formTypes:      new DropDownOptionsCollection()
			}
		});
		this.uiDropDownOptionsModel = new UIDropDownOptionsModel();
		this.formModel = new FormModel();
		this.formUIStateModel = formUIStateModel;
	}
});

export default FormService;