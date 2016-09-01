import Marionette from "backbone.marionette";
import {Model, Collection} from "backbone";
import React from 'react';
import {render} from 'react-dom';
import EVENTS from '../../constants/EVENTS';
import ROUTES from '../../constants/ROUTES';
import {formChannel, userChannel} from '../../channels/radioChannels';
import FormModel from '../../models/forms/FormModel';
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
		[EVENTS.FORM.SET_CORE_FORM_DETAILS]: 'handleFormMetadataSubmitData'
	},
	initialize(options = {}) {
		this.setupModels();
	},
	dispatchLayout({action, idSeq}) {
		switch(action){
			case "createForm":
				formRouter.navigate(ROUTES.FORM.CREATE_FORM, {trigger: true});
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
			default:
				console.error("no valid action provided");
		}
	},
	constructLayout(){
		/*Entry point for React. Backbone Views Keep Out */
		render(
			<FormLayout formModel={this.formModel} uiDropDownOptionsModel={this.uiDropDownOptionsModel.toJSON()} formUIState={this.formUIStateModel}/>, document.getElementById('main'));

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
		this.formModel.get('formModules').add(data);
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
				this.formUIStateModel.set({actionMode: 'editForm'});

				alert("Form created. formIdseq is: " + formIdseq);
			},
			error:   function(model, response){
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