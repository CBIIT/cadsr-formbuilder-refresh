import Service from "marionette-service";
import EVENTS from '../../constants/EVENTS';
import {appChannel, searchChannel} from '../../channels/radioChannels';
import SearchRouter from  "../../routers/search/SearchRouter";
import SearchLayoutView from '../../views/search/SearchLayoutView';
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
		[`search ${EVENTS.SEARCH.SEND_SEARCH_LAYOUT}`]: 'dispatchSearchLayout',
		[`search ${EVENTS.SEARCH.SEND_SEARCH_INPUTS}`]: 'handleSearchSubmitData'
	},
	initialize(options = {}) {
		const searchRouter = new SearchRouter();
		this.container = options.container;
		/* use singleton instead if we want to persist the search results client side */
		this.searchResultsCollection = new SearchResultsCollection();
		this.formSearchModel = new FormSearchModel();
		this.listenTo(this.searchResultsCollection, 'reset', this.dispatchSearchResultsReceived);
	},
	constructSearchLayout(){

		return new SearchLayoutView(
			{
				searchResultsCollection: this.searchResultsCollection,
				formSearchModel:         this.formSearchModel
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
	handleSearchSubmitData(data) {

		/*Add keys for context restricions into format for model */
		const contextRestriction = [];
		if(data.TEST){
			contextRestriction.push("TEST");
		}
		if(data.Training){
			contextRestriction.push("Training");
		}

		/*omit/clean submitted form data that shouldn't be bound to the form search model */
		let cleansedData = _.omit(data, ['TEST', 'Training', 'latestVersion']);

		const formSearchModelData = Object.assign({},
			cleansedData,
			{contextRestriction: contextRestriction},
			{latestVersion: data.latestVersion}
		);
		/*Save form search field data so user sees form fields as entered before */
		this.formSearchModel.set(formSearchModelData);

		/* construct the url based on safeModelData and manipulated data */
		const url = `${urlHelpers.buildUrl(this.searchResultsCollection.baseUrl, cleansedData)}&version=${data.latestVersion ? 'latestVersion' : ''}${this.contendRestrictionParam(contextRestriction)}`;

		this.searchResultsCollection.fetch({
			url:   url,
			reset: true
		});
	},
	contendRestrictionParam(list){
		let paramString = "";
		list.forEach((item) =>{
			paramString += `&contextRestriction='${item}'`;
		});

		return paramString;
	}
});

export default SearchService;