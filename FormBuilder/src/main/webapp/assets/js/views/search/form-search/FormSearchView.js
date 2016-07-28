import * as Marionette from 'backbone.marionette';
import template from '../../../../templates/search/form-search/form-search.html';

const FormSearchView = Marionette.ItemView.extend({
	template: template,
	events: {
		'click #search-button': 'submitSearch'
	},
	onBeforeShow(){
	console.log("before show");
	},
	submitSearch(){

	}
});

export default FormSearchView;