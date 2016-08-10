import {LayoutView} from 'backbone.marionette';
import EVENTS from '../../../constants/EVENTS';
import {searchChannel} from '../../../channels/radioChannels'
import Syphon from 'backbone.syphon';
import TextInputView from '../../forms/inputs/TextInputView';
import SelectInputView from '../../forms/inputs/SelectInputView';
import template from '../../../../templates/search/form-search/form-search.html';

const FormSearchView = LayoutView.extend({
	template: template,
	regions:  {
		formLongNameInput:     '.longname-input',
		publicIdInput:         '.publicid-input',
		protocolLongNameInput: '.protocol-longname-input',
		classificationInput:   '.classification-input',
		cdePublicIdInput:      '.cde-publicid-input',
		moduleInput:           '.module-input',
		categoriesDropdown:    '.categories-dropdown',
		contextsDropdwon:      '.contexts-dropdown',
		typesDropDown:         '.types-dropdown',
		workflowsDropdown:     '.workflows-dropdown'
	},
	/* cache the selectors on render using ui instead of inside events */
	ui:       {
		"form": ".search-form"
	},
	events:   {
		'submit @ui.form': 'gatherData'
	},
	onBeforeShow(){
		/*TODO Figure out a more DRY way to do this. The regions' selectors are separately being specified in the template: Might be worth re-working later to dynamically drop in views */
		this.showChildView('formLongNameInput', new TextInputView({
			label: 'Form Long Name',
			name:  'formLongName'
		}));

		this.showChildView('publicIdInput', new TextInputView({
			label: 'Public Id',
			name:  'publicId'
		}));
		this.showChildView('protocolLongNameInput', new TextInputView({
			label: 'Protocol Long Name',
			name:  'protocolLongName'
		}));
		this.showChildView('classificationInput', new TextInputView({
			label: 'CS/CSI (Classification)',
			name:  'classification'
		}));
		this.showChildView('moduleInput', new TextInputView({
			label: 'Module',
			name:  'moduleLongName'
		}));
		this.showChildView('cdePublicIdInput', new TextInputView({
			label: 'CDE Public ID',
			name:  'cdePublicId'
		}));
		this.showChildView('categoriesDropdown', new SelectInputView({
			label:   'Category',
			options: this.model.get('categories'),
			name:    'categoryName'
		}));
		this.showChildView('workflowsDropdown', new SelectInputView({
			label:   'Workflows',
			options: this.model.get('workflows'),
			name:    'workflow'
		}));
		this.showChildView('contextsDropdwon', new SelectInputView({
			label:   'Context',
			options: this.model.get('contexts'),
			optionKey: 'contextIdSeq',
			name:    'contextIdSeq'
		}));
		this.showChildView('typesDropDown', new SelectInputView({
			label:   'Types',
			options: this.model.get('types'),
			value:   this.model.get('type'),
			name:    'type'
		}));
	},
	gatherData(e){
		e.preventDefault();
		this.dispatchFormData(Syphon.serialize(this));
	},
	dispatchFormData(data){
		searchChannel.request(EVENTS.SEARCH.SEND_SEARCH_INPUTS, data);
	}
});

export default FormSearchView;