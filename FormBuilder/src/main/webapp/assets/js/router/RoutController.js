import {AppRouter} from 'backbone.marionette';

export const Controller = Object.extend({
	initialize(){
		/** The region manager gives us a consistent UI and event triggers across
		 our different layouts.
		 */
		this.options.regionManager = new Marionette.RegionManager({
			regions: {

				main: '#main'
			}
		});
		let initialData = this.getOption('initialData');

		let layout = new LayoutView({
			collection: new BlogList(initialData.posts)
		});

		this.getOption('regionManager').get('main').show(layout);

		/** We want easy access to our root view later */
		this.options.layout = layout;
	},

	/** List all blog entrys with a summary */
	blogList(){
		let layout = this.getOption('layout');
		layout.triggerMethod('show:blog:list');
	},

	/** List a named entry with its comments underneath */
	blogEntry: function(entry) {
		let layout = this.getOption('layout');
		layout.triggerMethod('show:blog:entry', entry);
	}
});