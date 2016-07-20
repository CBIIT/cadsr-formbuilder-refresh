import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import {Header, Footer, ListView} from './views';

let filterChannel = Radio.channel('filter');

export const AppLayoutView = Marionette.LayoutView.extend({

	el: '#app',

	regions: {
		searchCriteria: '#search-criteria',
		searchResults: '#search-results',
	},

	initialize: function() {
		this.showHeader();
		this.showFooter();
		this.showSearchResultsPane();
	},

	showHeader: function () {
		const header = new Header({
			collection: this.collection
		});
		this.showChildView('header', header);
	},

	showFooter: function () {
		const footer = new Footer({
			collection: this.collection
		});
		this.showChildView('footer', footer);
	}
});

