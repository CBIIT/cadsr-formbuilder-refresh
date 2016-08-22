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
		searchPreferences: ".search-preferences",
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
		this.searchPreferencesModel = options.searchPreferencesModel;

		searchChannel.reply(EVENTS.SEARCH.RESULTS_COLLECTION_RESET, () =>{
			this.showSearchResultsView(options.searchResultsCollection);
		});
	},
	onBeforeShow() {
		this.showFormSearchView();
		this.showSearchPreferences();
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
	},
	showSearchPreferences(){
		const view = new SearchPreferencesView({
			model: this.searchPreferencesModel
		});
		this.showChildView('searchPreferences', view);
	}
});

export default SearchLayoutView;

