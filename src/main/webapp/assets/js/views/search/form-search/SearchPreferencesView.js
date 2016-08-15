import * as Marionette from 'backbone.marionette';
import template from '../../../../templates/search/search-preferences.html';

const SearchPreferencesView = Marionette.ItemView.extend({
	template: template,
});

export default SearchPreferencesView;