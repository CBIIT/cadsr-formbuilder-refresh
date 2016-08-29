import {View} from 'backbone.marionette';
import FormMetadataView from './FormMetadataView';
import template from '../../../templates/form/form-layout.html';

const FormLayoutView = View.extend({
	template: template,
	regions:  {
		formMetadata:    '#core-form-details-wrapper'
	},
	initialize({formModel, uiDropDownOptionsModel}){
		this.formModel = formModel;
		this.uiDropDownOptionsModel = uiDropDownOptionsModel;
	},
	onBeforeAttach() {
		this.FormDetailsView();
	},
	FormDetailsView(){
		const view = new FormMetadataView({
			uiDropDownOptionsModel: this.uiDropDownOptionsModel,
			model: this.formModel.get("formMetadata")
		});
		this.showChildView('formMetadata', view);
	}
});

export default FormLayoutView;

