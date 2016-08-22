import app from './App';
import * as Backbone from 'backbone';
import SearchService from  "./services/search/SearchService";
import FormService from  "./services/form/FormService";
import UserService from  "./services/user/UserService";

app.on('start', function(){

	this.form = new FormService({
		container: this.layout.getRegion("main")
	});

	this.search = new SearchService({
		container: this.layout.getRegion("main")
	});

	this.form = new UserService({
		container: this.layout.getRegion("main")
	});

	Backbone.history.start();
});

app.start();
