import Marionette from "backbone.marionette";
import {Model, Collection} from "backbone";
import React from 'react';
import {render} from 'react-dom';
import EVENTS from '../../constants/EVENTS';
import ROUTES from '../../constants/ROUTES';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';
import {formChannel, userChannel} from '../../channels/radioChannels';
import FormModel from '../../models/forms/FormModel';
import FormModuleModel from '../../models/forms/FormModuleModel';
import formUIStateModel from '../../models/forms/FormUIStateModel';
import formRouter from  "../../routers/FormRouter";
import DropDownOptionsCollection from '../../models/forms/DropDownOptionsCollection';
import GetFormMetadataCriteriaCommand from '../../commands/GetFormMetadataCriteriaCommand';
import FormLayout from '../../components/form/FormLayout';

/**
 * This is a service that maintains the state of a form
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */

const FormService = Marionette.Object.extend({
	channelName:   'form',
	radioRequests: {
		[EVENTS.FORM.SET_FORM_LAYOUT]:       'dispatchLayout',
		[EVENTS.FORM.CREATE_MODULE]:         'dispatchLayout',
		[EVENTS.FORM.SET_CORE_FORM_DETAILS]: 'handleFormMetadataSubmitData',
		[EVENTS.FORM.SET_NEW_MODULE]:        'handleAddModule',
		[EVENTS.FORM.SET_MODULE]:            'handleSetModule',
		[EVENTS.FORM.SAVE_FORM]:             'handleSaveForm',
		[EVENTS.FORM.VIEW_MODULE]:           'setModuleView'
	},
	initialize(options = {}) {
		this.setupModels();
	},
	dispatchLayout({action, formIdSeq}) {
		switch(action){
			case "createForm":
				formRouter.navigate(ROUTES.FORM.CREATE_FORM, {trigger: true});
				if(!this.formModel.isNew()){
					/* TODO make sure no more than two instances of FormModel exist. One for a form being edited and another for a form being viewed */
					delete this.formModel;
					this.formModel = new FormModel();
				}
				this.formUIStateModel.set({actionMode: action});
				this.fetchFormMetaDataCriteria();
				break;
			case "createModule":
				this.formUIStateModel.set({actionMode: action});

				break;
			case "editForm":
				this.formUIStateModel.set({actionMode: action});

				break;
			case "editModule":
				this.formUIStateModel.set({actionMode: action});

				break;
			case "editQuestion":
				this.formUIStateModel.set({actionMode: action});

				break;
			case "viewFormFullView":
				this.formUIStateModel.set({actionMode: action});
				this.fetchForm({formIdSeq: formIdSeq});
				break;
			default:
				console.error("no valid action provided");
		}
	},
	constructLayout(){
		/*Entry point for React. Backbone Views Keep Out */
		render(
			<FormLayout formModel={this.formModel.attributes} uiDropDownOptionsModel={this.uiDropDownOptionsModel.toJSON()} formUIState={this.formUIStateModel}/>, document.getElementById('main'));

	},
	fetchForm({formIdSeq}) {
		this.formModel.set({formIdseq: formIdSeq});
		/*TODO add catch() for error handling */
		this.formModel.fetch().then(() =>{
			this.constructLayout();
		});
	},
	fetchFormMetaDataCriteria() {
		formChannel.on(EVENTS.FORM.GET_FORM_CORE_DETAILS_CRITERIA, () =>{
			this.constructLayout();
		});

		new GetFormMetadataCriteriaCommand({
			model:    this.uiDropDownOptionsModel,
			userName: userChannel.request(EVENTS.USER.GET_USERNAME)
		}).execute();
	},
	handleAddModule(data) {
		const newModuleModel = this.formModel.get('formModules').add(new FormModuleModel(data));
		this.setModuleView(newModuleModel.cid);
	},
	handleSaveForm() {
		this.formModel.save(null, {
			dataType: 'text',
			success:  () =>{
				alert("form saved");
			},
			error:    (model, response) =>{
				/*TODO: of course this is too basic. Improve error handling */
				alert("error");
			}
		});
	},
	handleSetModule(data) {
		const module = this.formModel.get('formModules').get(data.id);
		const moduleAttributes = _.omit(data, "id");
		module.set(moduleAttributes);
		if(module.get("moduleIdSeq") && !module.get("isEdited")){
			module.set("isEdited", true);
		}

		this.formUIStateModel.set({
			actionMode: 'viewFormFullView',
			editItem:   null
		});
		formRouter.navigate(ROUTES.FORM.VIEW_FORM, {trigger: false});
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
			context:   {conteIdseq: context},
			createdBy: userChannel.request(EVENTS.USER.GET_USERNAME)
		});

		this.formModel.get('formMetadata').save(null, {
			success: (model) =>{
				let formIdseq = model.get("formIdseq");
				this.formModel.set({
					formIdseq: formIdseq
				});
				this.formUIStateModel.set({actionMode: 'viewFormFullView'});

				alert("Form created. formIdseq is: " + formIdseq);
			},
			error:   (model, response) =>{
				/*TODO: of course this is too basic. Improve error handling */
				alert("error");
			}
		});
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