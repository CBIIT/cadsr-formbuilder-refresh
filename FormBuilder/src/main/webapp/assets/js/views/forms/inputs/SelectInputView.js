import {ItemView} from 'backbone.marionette';
import Backbone  from 'backbone';
import template from '../../../../templates/common/inputs/select-input.html';

const SelectInputView = ItemView.extend({
	className: ".form-group",
	template:  template,
	serializeData(){
		return {
			label:   this.model.get('label'),
			name:    this.model.get('name'),
			value:   this.model.get('value'),
			/*Because options is a collection, it needs to be converted into JSON to be made available to (and not break) the template */
			options: this.model.get('options').toJSON()
		};
	},
	initialize(options){
		/* Putting options/attrs inside a local model to potentially help with maintainability later on, but each input having its own model could have a performance hit. Revisit whether this is worth it. */
		const Model = Backbone.Model.extend({});
		this.model = new Model(options);
	}
});

export default SelectInputView;