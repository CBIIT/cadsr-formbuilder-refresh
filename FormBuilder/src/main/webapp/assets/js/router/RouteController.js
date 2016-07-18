import * as Marionette from 'backbone.marionette';

export const RouteController = Marionette.Object.extend({
	initialize(){
		/** The region manager gives us a consistent UI and event triggers across
		 our different layouts.
		 */
		this.options.regionManager = RegionManager({
			regions: {
				header: '#header',
				main: '#main',
				footer: '#footer'
			}
		});
	}
});