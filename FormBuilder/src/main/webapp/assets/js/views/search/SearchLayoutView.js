import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import template from '../../../templates/search/search-layout.html';
import SearchResultsView from './form-search/SearchResultsView';
let filterChannel = Radio.channel('filter');

const SearchLayoutView = Marionette.LayoutView.extend({
	template: template,
	tagMame:  "section",
	regions: {
		searchCriteria: '#search-form-wrapper',
		searchResults:  '#search-results-wrapper',
	},
	onRender() {
		this.showSearchForm();
		this.showSearchResultsView();
	},
	showSearchForm(){
	},
	showSearchResultsView(){
		/*TODO move this, just testing now */
		this.collection.fetch();
		const view = new SearchResultsView({
			collection: this.collection
		});
		this.showChildView('searchResults', view);
	}
	/*
	 showSearchForm () {
	 const searchLayoutView = new SearchLayoutView({});
	 this.showChildView('header', searchLayoutView);
	 }*/
});

export default SearchLayoutView;

