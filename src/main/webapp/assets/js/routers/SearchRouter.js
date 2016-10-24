import * as Backbone from 'backbone';
import EVENTS from '../constants/EVENTS';
import ROUTES from '../constants/ROUTES';
import {searchChannel} from '../channels/radioChannels';

const SearchRouter = Backbone.Router.extend({
	routes: {
		'': 'searchLayout',
		[ROUTES.SEARCH.SEARCH_FORMS]: 'searchLayout'
	},
	searchLayout: function () {
		searchChannel.request(EVENTS.SEARCH.SEND_SEARCH_LAYOUT);
	}});

export default SearchRouter;
