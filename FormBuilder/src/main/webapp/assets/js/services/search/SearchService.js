import Service from "marionette-service";
import EVENTS from '../../constants/EVENTS';
import {appChannel, searchChannel} from '../../channels/radioChannels';
import SearchRouter from  "../../routers/search/SearchRouter";
import SearchLayoutView from '../../views/search/SearchLayoutView';
import searchContextRestrictionModel from '../../models/search/SearchContextRestrictionModel';
import FormSearchModel from '../../models/search/form-search/FormSearchModel';
import urlHelpers from '../../helpers/urlHelpers';

import SearchResultsCollection from '../../models/search/form-search/SearchResultsCollection';
import GetSearchFormCriteriaCommand from '../../commands/GetSearchFormCriteriaCommand';

/**
 * This is a simple service that maintains the
 * state of search functionality, and passes it on
 * to any other parts of the code that request it
 * This currently uses Marionette-service for its service
 * object, in Mn 3.0 this will be replaceable with
 * Marionette.Object without any external dependencies
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */
const SearchService = Service.extend({
	radioRequests: {
		[`search ${EVENTS.SEARCH.SEND_SEARCH_LAYOUT}`]:      'dispatchSearchLayout',
		[`search ${EVENTS.SEARCH.SEND_SEARCH_INPUTS}`]:      'handleSearchSubmitData',
		[`search ${EVENTS.SEARCH.SAVE_SEARCH_PREFERENCES}`]: 'handlePreferencesSave'
	},
	initialize(options = {}) {
		const searchRouter = new SearchRouter();
		this.container = options.container;
		/* use singleton instead if we want to persist the search results client side */
		this.searchResultsCollection = new SearchResultsCollection();
		this.formSearchModel = new FormSearchModel();
		this.searchContextRestrictionModel = searchContextRestrictionModel;

		this.listenTo(this.searchResultsCollection, 'reset', this.dispatchSearchResultsReceived);
	},
	constructSearchLayout(){

		return new SearchLayoutView(
			{
				searchContextRestrictionModel: searchContextRestrictionModel,
				searchResultsCollection:       this.searchResultsCollection,
				formSearchModel:               this.formSearchModel
			}
		);
	},
	dispatchSearchLayout() {
		searchChannel.on('model:getDropDownOptionsSuccess', () =>{
			appChannel.request(EVENTS.APP.SET_MAIN_CONTENT_LAYOUT, this.constructSearchLayout());
		});

		new GetSearchFormCriteriaCommand({model: this.formSearchModel}).execute();

	},
	dispatchSearchResultsReceived(){
		searchChannel.request(EVENTS.SEARCH.RESULTS_COLLECTION_RESET);
	},
	handlePreferencesSave(data) {
		this.searchContextRestrictionModel.set(data);
	},
	handleSearchSubmitData(data) {
		/*Save form search field data so user sees form fields as entered before */
		this.formSearchModel.set(data);

		this.searchResultsCollection.fetch({
			url:   `${urlHelpers.buildUrl(this.searchResultsCollection.baseUrl, data)}${this.setContextRestrictionParams(this.searchContextRestrictionModel.attributes)}`,
			reset: true
		});
	},
	setContextRestrictionParams(object){
		let paramString = "";
		for(let index in object){
			if(object[index]){
				paramString += `${index},`;
			}
		}
		return paramString ? `&contextRestriction='${paramString}'` : '';
	}
});

export default SearchService;