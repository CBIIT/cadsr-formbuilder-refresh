import App from './App';
import * as Backbone from 'backbone';
import $ from 'jquery';
import Router from './router/Router'

Backbone.$ = $;

App.on('start', function () {
	const router = new Router();
	Backbone.history.start();
});

App.start();
