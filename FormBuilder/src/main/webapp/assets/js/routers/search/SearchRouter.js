import * as Backbone from 'backbone';
import {searchChannel} from '../../channels/radioChannels'

const SearchRouter = Backbone.Router.extend({
	routes: {
		'': 'searchLayout',
		'search': 'searchLayout',
	},
	searchLayout: function () {
		searchChannel.request('set:searchLayout');
	}});

export default SearchRouter;
