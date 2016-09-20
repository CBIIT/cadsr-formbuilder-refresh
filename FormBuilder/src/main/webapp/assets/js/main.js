import app from './App';
import * as Backbone from 'backbone';
import SearchService from  "./services/search/SearchService";
import FormService from  "./services/form/FormService";
import UserService from  "./services/user/UserService";

app.on('start', function(){

	app.formService = new FormService();

	app.searchService = new SearchService();

	app.userService = new UserService();

	Backbone.history.start();
});

app.start();
