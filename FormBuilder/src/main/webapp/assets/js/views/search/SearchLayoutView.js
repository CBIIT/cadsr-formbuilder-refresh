import {LayoutView} from 'backbone.marionette';
import EVENTS from '../../constants/EVENTS';
import {searchChannel, formChannel} from '../../channels/radioChannels';
import template from '../../../templates/search/search-layout.html';
import FormSearchView from './form-search/FormSearchView';
import SearchResultsView from './form-search/SearchResultsView';
import SearchPreferencesView from './form-search/SearchPreferencesView';

const SearchLayoutView = LayoutView.extend({
	template: template,
	regions:  {
		searchCriteria:    '#search-form-wrapper',
		searchResults:     '#search-results-wrapper'
	},
	events: {
		"click .create-new-form-button": "dispatchCreateForm"
	},
	dispatchCreateForm () {
		formChannel.request(EVENTS.FORM.CREATE_FORM);
	},
	initialize(options){
		this.formSearchModel = options.formSearchModel;
		this.searchContextRestrictionModel = options.searchContextRestrictionModel;

		searchChannel.reply(EVENTS.SEARCH.RESULTS_COLLECTION_RESET, () =>{
			this.showSearchResultsView(options.searchResultsCollection);
		});
	},
	onBeforeShow() {
		this.showFormSearchView();
	},
	showFormSearchView(){
		const view = new FormSearchView({
			model: this.formSearchModel
		});
		this.showChildView('searchCriteria', view);
	},
	showSearchResultsView(resultsCollection){
		const view = new SearchResultsView({
			collection: resultsCollection
		});
		this.showChildView('searchResults', view);
	}
});

export default SearchLayoutView;

