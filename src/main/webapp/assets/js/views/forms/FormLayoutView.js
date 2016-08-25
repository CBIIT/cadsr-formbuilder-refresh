import {LayoutView} from 'backbone.marionette';
import CoreFormDetailsView from './CoreFormDetailsView';
import template from '../../../templates/form/form-layout.html';

const FormLayoutView = LayoutView.extend({
	template: template,
	regions:  {
		coreFormDetails:    '#core-form-details-wrapper'
	},
	initialize({formModel, uiDropDownOptionsModel}){
		this.formModel = formModel;
		this.uiDropDownOptionsModel = uiDropDownOptionsModel;
	},
	onBeforeShow() {
		this.FormDetailsView();
	},
	FormDetailsView(){
		const view = new CoreFormDetailsView({
			uiDropDownOptionsModel: this.uiDropDownOptionsModel,
			model: this.formModel.get("coreFormDetails")
		});
		this.showChildView('coreFormDetails', view);
	}
});

export default FormLayoutView;

