import  {ItemView} from 'backbone.marionette';
import Syphon from 'backbone.syphon';
import EVENTS from '../../../constants/EVENTS';
import {searchChannel} from '../../../channels/radioChannels';
import template from '../../../../templates/search/search-preferences.html';

const SearchPreferencesView = ItemView.extend({
	template: template,
	ui:       {
		"form": ".search-preferences-form"
	},
	events:   {
		'submit @ui.form': 'gatherData'
	},
	gatherData(evemt){
		evemt.preventDefault();
		this.dispatchFormData(Syphon.serialize(this));
	},
	dispatchFormData(data){
		searchChannel.request(EVENTS.SEARCH.SAVE_SEARCH_PREFERENCES, data);
	}
});

export default SearchPreferencesView;