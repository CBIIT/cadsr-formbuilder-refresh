import app from './App';
import * as Backbone from 'backbone';
import SearchService from  "./services/search/SearchService";

app.on('start', function(){
	this.search = new SearchService({
		container: this.layout.getRegion("main")
	});

	Backbone.history.start();
});

app.start();
