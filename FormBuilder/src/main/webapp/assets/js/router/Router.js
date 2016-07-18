import {AppRouter} from 'backbone.marionette';
import RouteController from './RouteController';

export const Router = AppRouter.extend({
	appRoutes: {
		'search/': 'search',
		'index': 'indexRoute'
	},
	initialize(){
		this.controller = new RouteController({});
	}
});