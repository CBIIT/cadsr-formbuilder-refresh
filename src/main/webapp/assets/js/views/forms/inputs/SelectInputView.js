import {ItemView} from 'backbone.marionette';
import Backbone  from 'backbone';
import template from '../../../../templates/common/inputs/select-input.html';

const SelectInputView = ItemView.extend({
	className: ".form-group",
	template:  template,
	serializeData(){
		const inputName = this.model.get('name');
		return {
			label:     this.model.get('label'),
			name:      inputName,
			value: this.model.get('value') || this.model.get([inputName]),
			/*Because options is a collection, it needs to be converted into JSON to be made available to (and not break) the template */
			options:   this.model.get('options').toJSON(),
			optionKey: this.model.get('optionKey') || 'name'
		};
	},
	initialize(options){
		/* Putting options/attrs inside a local model to potentially help with maintainability later on, but each input having its own model could have a performance hit. Revisit whether this is worth it. */
		const Model = Backbone.Model.extend({});
		this.model = new Model(options);
	}
});

export default SelectInputView;