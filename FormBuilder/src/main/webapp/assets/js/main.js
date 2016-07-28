import app from './App';
import * as Backbone from 'backbone';
import $ from 'jquery';
import SearchController from  "./controllers/search/SearchController";

Backbone.$ = $;

app.on('start', function(){

	this.search = new SearchController();

	Backbone.history.start();
});

app.start();
