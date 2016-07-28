import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import template from '../../../templates/search/search-layout.html';
import FormSearchView from './form-search/FormSearchView';
import SearchResultsView from './form-search/SearchResultsView';
let filterChannel = Radio.channel('filter');

const SearchLayoutView = Marionette.LayoutView.extend({
	template: template,
	tagMame:  "section",
	regions: {
		searchCriteria: '#search-form-wrapper',
		searchResults:  '#search-results-wrapper',
	},
	onBeforeShow() {
		this.showFormSearchView();
	},
	showFormSearchView(){
		const view = new FormSearchView({});
		this.showChildView('searchCriteria', view);
	},
	showSearchResultsView(){
		const view = new SearchResultsView({
			collection: this.collection
		});
		this.showChildView('searchResults', view);
	}
});

export default SearchLayoutView;

