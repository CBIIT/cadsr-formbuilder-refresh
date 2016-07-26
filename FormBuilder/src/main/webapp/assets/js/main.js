import app from './App';
import * as Backbone from 'backbone';
import $ from 'jquery';
import SearchController from  "./controllers/search/SearchController";

Backbone.$ = $;

app.on('start', function(){

	this.search = new SearchController({
		container: this.layout.getRegion("main")
	});

	Backbone.history.start();
});

app.start();
