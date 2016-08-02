import Service from "marionette-service";
import EVENTS from '../../constants/EVENTS';
import {appChannel, searchChannel} from '../../channels/radioChannels'
import SearchRouter from  "../../routers/search/SearchRouter";
import SearchLayoutView from '../../views/search/SearchLayoutView';
import searchPreferencesModel from '../../models/search/SearchPreferencesModel';
import FormSearchModel from '../../models/search/form-search/FormSearchModel';
import urlHelpers from '../../helpers/urlHelpers';
import SearchResultsCollection from '../../collections/search/form-search/SearchResultsCollection';

/**
 * This is a simple service that maintains the
 * state of search functionality, and passes it on
 * to any other parts of the code that request it
 * This currently uses Marionette-service for its service
 * object, in Mn 3.0 this will be replaceable with
 * Marionette.Object without any external dependencies
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */
const SearchController = Service.extend({
	radioRequests: {
		'search set:searchLayout': 'dispatchSearchLayout',
	},
	initialize(options = {}) {
		const searchRouter = new SearchRouter();
		this.container = options.container;
		/* use singleton instead if we want to persist the search results client side */
		this.searchResultsCollection = new SearchResultsCollection();
		this.formSearchModel = new FormSearchModel();

		searchChannel.reply(EVENTS.SEARCH.SEND_SEARCH_INPUTS, (data) =>{
			this.handleSearchSubmitData(data);
		});

		this.listenTo(this.searchResultsCollection, 'reset', this.dispatchSearchResultsReceived);
	},
	constructSearchLayout(){
		return new SearchLayoutView(
			{
				searchPreferencesModel:  searchPreferencesModel,
				searchResultsCollection: this.searchResultsCollection,
				formSearchModel:         this.formSearchModel
			}
		);
	},
	dispatchSearchLayout() {
		appChannel.request(EVENTS.APP.SET_MAIN_CONTENT_LAYOUT, this.constructSearchLayout());
	},
	dispatchSearchResultsReceived(){
		searchChannel.request(EVENTS.SEARCH.RESULTS_COLLECTION_RESET);
	},
	handleSearchSubmitData(data) {
		/*Save form search field data so user sees form fields as entered before */
		this.formSearchModel.set(data);
		this.searchResultsCollection.url = urlHelpers.buildUrl(this.searchResultsCollection.baseUrl, data);
		this.searchResultsCollection.fetch({
			reset: true
		})
	}
});

export default SearchController;