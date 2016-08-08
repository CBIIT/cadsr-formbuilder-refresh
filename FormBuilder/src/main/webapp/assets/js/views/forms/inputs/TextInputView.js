import {ItemView} from 'backbone.marionette';
import Backbone  from 'backbone';
import template from '../../../../templates/common/inputs/text-input.html';

const TextInputView = ItemView.extend({
	className: ".form-group",
	template: template,
	serializeData(){
		return {
			label: this.model.get('label'),
			name: this.model.get('name'),
			value: this.model.get('value'),
			type: 'text' || this.model.get('type'),
			/*More attrs like required, min, max, can be added here */
		};
	},
	initialize(options){
		/* Putting options/attrs inside a local model to potentially help with maintainability later on, but each input having its own model could have a performance hit. Revisit whether this is worth it. */
		const Model = Backbone.Model.extend({});
		this.model = new Model(options);
	}
});

export default TextInputView;