import app from './App';
import * as Backbone from 'backbone';
import SearchService from  "./services/search/SearchService";
import CartsService from  "./services/carts/CartsService";
import FormService from  "./services/form/FormService";
import UserService from  "./services/user/UserService";

app.on('start', function(){

	app.formService = new FormService({
		app: app
	});

	app.searchService = new SearchService({
		app: app
	});

	app.userService = new UserService({
		app: app
	});

	app.cartsService = new CartsService({
		app: app
	});

	Backbone.history.start();
});

app.start();
