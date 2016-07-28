import * as Backbone from 'backbone';
import Radio from 'backbone.radio';

let searchChannel = Radio.channel('search');

const SearchRouter = Backbone.Router.extend({
	routes: {
		'': 'searchLayout',
		'search': 'searchLayout',
	},
	searchLayout: function () {
		searchChannel.request('searchLayout');
	}});

export default SearchRouter;
