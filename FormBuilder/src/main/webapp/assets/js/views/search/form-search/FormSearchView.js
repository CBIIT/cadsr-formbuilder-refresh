import * as Marionette from 'backbone.marionette';
import EVENTS from '../../../constants/EVENTS';
import {searchChannel} from '../../../channels/radioChannels'
import Syphon from 'backbone.syphon';
import template from '../../../../templates/search/form-search/form-search.html';


const FormSearchView = Marionette.ItemView.extend({
	template: template,
	/* cache the selectors on render using ui instead of inside events */
	ui:       {
		"form": ".search-form"
	},
	events:   {
		'submit @ui.form': 'gatherData'
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