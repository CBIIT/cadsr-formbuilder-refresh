import Marionette from "backbone.marionette";
import {Model, Collection} from "backbone";
import React from 'react';
import {render} from 'react-dom';
import EVENTS from '../../constants/EVENTS';
import ROUTES from '../../constants/ROUTES';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';
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
		[EVENTS.FORM.EDIT_FORM]:             'handleSetFormEditable',
		[EVENTS.FORM.SET_FORM_LAYOUT]:       'dispatchLayout',
		[EVENTS.FORM.CREATE_MODULE]:         'dispatchLayout',
		[EVENTS.FORM.SET_CORE_FORM_DETAILS]: 'handleFormMetadataSubmitData',
		[EVENTS.FORM.SET_NEW_MODULE]:        'handleAddModule',
		[EVENTS.FORM.SET_MODULE]:            'handleSetModule',
		[EVENTS.FORM.SAVE_FORM]:             'handleSaveForm',
		[EVENTS.FORM.VIEW_MODULE]:           'setModuleView'
	},
	/* Stores cart data retrieved from carService */
	carts:         null,
	initialize({app}) {
		this.app = app;
		this.setupModels();
	},
	dispatchLayout({action, formIdseq = this.formModel.get('formIdseq')}) {
		switch(action){
			case "createForm":
				this.formUIStateModel.set({actionMode: action});
				formRouter.navigate(ROUTES.FORM.CREATE_FORM, {trigger: true});
				if(!this.formModel.isNew()){
					delete this.formModel;
					this.formModel = new FormModel();
				}
				this.getCartData();
				this.fetchFormMetaDataCriteria();
				break;
			case "createModule":
				this.formUIStateModel.set({actionMode: action});
				break;
			case "editModule":
				this.formUIStateModel.set({actionMode: action});
				break;
			case "editQuestion":
				this.formUIStateModel.set({actionMode: action});
				break;
			case "editFormMetadata":
				this.formUIStateModel.set({actionMode: action});
				this.fetchFormMetaDataCriteria();
				break;
			case "viewFormFullView":
				this.formUIStateModel.set({actionMode: action});
				if(formIdseq !== this.formModel.get('formIdseq')){
					this.fetchForm({formIdseq: formIdseq});
				}
				this.getCartData();
				break;
			default:
				console.error("no valid action provided");
		}
	},
	constructLayout(){
		/*Entry point for React. Backbone Views Keep Out */
		render(
			<FormLayout carts={this.carts} formModel={this.formModel.attributes} uiDropDownOptionsModel={this.uiDropDownOptionsModel.toJSON()} formUIState={this.formUIStateModel}/>, document.getElementById('main'));

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
				this.formUIStateModel.set({
					isEditing:  true,
					actionMode: 'viewFormFullView'
				});
				alert("Form created. formIdseq is: " + formIdseq);
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
	getCartData() {
		/*Only retrieve carts if user actually exists */
		if(appChannel.request(EVENTS.USER.GET_USERNAME)){
			return this.app.cartsService.fetchCarts().then((carts)=>{
				this.carts = carts;
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
		this.saveForm().then(() =>{
			alert("Module Added");
		});
		this.formUIStateModel.set({
			editItem:   null,
			actionMode: 'viewFormFullView'
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
		this.saveForm({successMessage: "Module Saved"});
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
			console.log(error);
		});
	},
	setModuleView(id) {
		const moduleModel = this.formModel.get('formModules').get(id);
		/* just pass in a POJO including the model's cid into the view */
		const moduleToEdit = Object.assign({}, moduleModel.attributes, {
			isEdited: true,
			id:       id
		});
		/*TODO: Prepare for when editing a module with repetitions, this will be an array containing the module and its associated repetitioned modules */
		this.formUIStateModel.set({editItem: moduleToEdit});
		this.dispatchLayout({action: "editModule"});
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