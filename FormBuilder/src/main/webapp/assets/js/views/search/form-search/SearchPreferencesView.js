import {View} from 'backbone.marionette';
import template from '../../../../templates/search/search-preferences.html';

const SearchPreferencesView = View.extend({
	template: template,
	serializeData () {
		return {
			TEST:     this.model.indexOf('TEST') > -1,
			Training: this.model.indexOf('Training') > -1
		};
	}
});

export default SearchPreferencesView;