import * as Backbone from 'backbone';
import EVENTS from '../../constants/EVENTS'
import {searchChannel} from '../../channels/radioChannels'

const SearchRouter = Backbone.Router.extend({
	routes: {
		'': 'searchLayout',
		'search': 'searchLayout',
	},
	searchLayout: function () {
		searchChannel.request(EVENTS.SEARCH.SEND_SEARCH_LAYOUT);
	}});

export default SearchRouter;
