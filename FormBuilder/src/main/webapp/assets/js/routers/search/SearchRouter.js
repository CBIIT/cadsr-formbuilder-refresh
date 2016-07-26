import * as Backbone from 'backbone';

const SearchRouter = Backbone.Router.extend({
	routes: {
		'search': 'initialize'
	}
});

export default SearchRouter;
