import {ItemView} from 'backbone.marionette';
import Backbone  from 'backbone';
import template from '../../../../templates/common/inputs/textarea-input.html';

const TextareaInputView = ItemView.extend({
	className: ".form-group",
	template:  template,
	serializeData(){
		const inputName = this.model.get('name');

		return {
			label: this.model.get('label'),
			name:  inputName,
			value: this.model.get('value') || this.model.get([inputName]),
			type:  this.model.get('type') || 'text',
			/* if not required, resolve to a space so the template prints nothing. required="false" in hTML resolves
			 to true */
			required: this.model.get('required') ? 'required' : ''
			/*More attrs like min, max, can be added here */
		};
	},
	initialize(options){
		/* Putting options/attrs inside a local model to potentially help with maintainability later on, but each input having its own model could have a performance hit. Revisit whether this is worth it. */
		const Model = Backbone.Model.extend({});
		this.model = new Model(options);
	}
});

export default TextareaInputView;