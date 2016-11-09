import Marionette from "backbone.marionette";
import EVENTS from '../../constants/EVENTS';
import {appChannel, searchChannel} from '../../channels/radioChannels';
import FormSearchModel from '../../models/search/form-search/FormSearchModel';
import urlHelpers from '../../helpers/urlHelpers';
import SearchResultsCollection from '../../models/search/form-search/SearchResultsCollection';
import GetSearchFormCriteriaCommand from '../../commands/GetSearchFormCriteriaCommand';

/**
 * This is a simple service that maintains the state of search functionality
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */
const SearchService = Marionette.Object.extend({
	channelName: 'search',
	radioRequests: {
		[EVENTS.SEARCH.SEND_SEARCH_LAYOUT]: 'dispatchSearchLayout',
		[EVENTS.SEARCH.SEND_SEARCH_INPUTS]: 'handleSearchSubmitData'
	},
	initialize() {
		/* use singleton instead if we want to persist the search results client side */
		this.searchResultsCollection = new SearchResultsCollection();
		this.formSearchModel = new FormSearchModel();
		this.listenTo(this.searchResultsCollection, 'reset', this.dispatchSearchResultsReceived);
	},
	dispatchSearchLayout() {
		new GetSearchFormCriteriaCommand({model: this.formSearchModel}).execute();
	},
	dispatchSearchResultsReceived(){
		searchChannel.request(EVENTS.SEARCH.RESULTS_COLLECTION_RESET, this.searchResultsCollection);
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
		const cleansedData = _.omit(data, ['TEST', 'Training', 'latestVersion']);

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
			reset: true,
			/*Fix addition of square brackets added to query by jQuery
			See http://stackoverflow.com/questions/18492127/backbone-js-fetch-method-with-data-option-is-passing-url-params-with-square-brac
			 */
			traditional: true
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
const searchService = new SearchService ();
export default searchService;