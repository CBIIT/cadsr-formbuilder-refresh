import {View} from 'backbone.marionette';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels'
import Syphon from 'backbone.syphon';
import TextInputView from '../forms/inputs/TextInputView';
import TextareaInputView from '../forms/inputs/TextareaInputView';
import SelectInputView from '../forms/inputs/SelectInputView';
import template from '../../../templates/form/core-form-details.html';

const CoreFormDetailsView = View.extend({
	template: template,
	regions:  {
		longNameInput:           '.longname-input',
		preferredDefinitionInput:           '.preferred-definition-input',
		protocolLongNameInput:   '.protocol-longname-input',
		classificationInput:     '.classification-input',
		categoriesDropdown:      '.categories-dropdown',
		contextsDropdwon:        '.contexts-dropdown',
		typesDropDown:           '.types-dropdown',
		workflowsDropdown:       '.workflows-dropdown',
		version: '.version',
		headerInstructionsInput: '.header-instructions-input',
		footerInstructionsInput: '.footer-instructions-input'
	},
	/* cache the selectors on render using ui instead of inside events */
	ui:       {
		"form": "#core-form-details-form"
	},
	events:   {
		'submit @ui.form': 'gatherData'
	},
	initialize({uiDropDownOptionsModel}){
		this.uiDropDownOptionsModel = uiDropDownOptionsModel;

	},
	onBeforeAttach(){
		this.showChildView('longNameInput', new TextInputView({
			label: 'Long Name',
			name:  'longName',
			required: true
		}));

		this.showChildView('preferredDefinitionInput', new TextareaInputView({
			label: 'Preferred Definition',
			name:  'preferredDefinition',
			required: true
		}));

		this.showChildView('contextsDropdwon', new SelectInputView({
			label:     'Context',
			options:   this.uiDropDownOptionsModel.get('contexts'),
			optionKey: 'contextIdSeq',
			name:      'conteIdseq',
			required: true
		}));

		/*this.showChildView('protocolLongNameInput', new TextInputView({
			label: 'Protocol Long Name',
			name:  'protocolLongName'
		}));*/
		this.showChildView('workflowsDropdown', new TextInputView({
			label:   'Workflow',
			name:    'workflow',
			value: this.model.get("workflow")
		}));

		this.showChildView('categoriesDropdown', new SelectInputView({
			label:   'Category',
			options: this.uiDropDownOptionsModel.get('formCategories'),
			name:    'formCategory'
		}));

		this.showChildView('typesDropDown', new SelectInputView({
			label:   'Type',
			options: this.uiDropDownOptionsModel.get('formTypes'),
			name:    'formType'
		}));

		this.showChildView('version', new TextInputView({
			label: 'Version',
			name:  'version',
			value: this.model.get("version")
		}));

		this.showChildView('headerInstructionsInput', new TextareaInputView({
			label: 'Header Instructions',
			name:  'instructions'
		}));

		this.showChildView('footerInstructionsInput', new TextareaInputView({
			label: 'Footer Instructions',
			name:  'footerInstructions'
		}));
	},
	gatherData(e){
		e.preventDefault();
		this.dispatchFormData(Syphon.serialize(this));
	},
	dispatchFormData(data){
		formChannel.trigger(EVENTS.FORM.SET_CORE_FORM_DETAILS, data);
	}
});

export default CoreFormDetailsView;