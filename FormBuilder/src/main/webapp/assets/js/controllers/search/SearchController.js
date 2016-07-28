import Service from "marionette-service";
import Radio from 'backbone.radio';
import SearchRouter from  "../../routers/search/SearchRouter";
import SearchLayoutView from '../../views/search/SearchLayoutView';
import SearchResultsCollection from '../../collections/search/form-search/SearchResultsCollection';

let appChannel = Radio.channel('appEvents');


/**
 * This is a simple service that maintains the
 * state of search functionality, and passes it on
 * to any other parts of the code that request it
 * This currently uses Marionette-service for its service
 * object, in Mn 3.0 this will be replaceable with
 * Marionette.Object without any external dependencies
 */
const SearchController = Service.extend({
	radioRequests: {
		'search searchLayout': 'dispatchSearchLayout',
	},
	initialize(options = {}) {
		this.container = options.container;
		//this.model = searchModel;
		const searchRouter = new SearchRouter();
	},
	constructSearchLayout(){
		return new SearchLayoutView(
			{
				collection: new SearchResultsCollection()
			}
		);
	},
	dispatchSearchLayout() {
		appChannel.request('set:mainLayout',this.constructSearchLayout());
	}
});

export default SearchController;