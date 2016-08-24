import  {ItemView} from 'backbone.marionette';
import template from '../../../../templates/search/search-preferences.html';

const SearchPreferencesView = ItemView.extend({
	template: template,
	serializeData () {
		return {
			TEST:     this.model.indexOf('TEST') > -1,
			Training: this.model.indexOf('Training') > -1
		};
	}
});

export default SearchPreferencesView;