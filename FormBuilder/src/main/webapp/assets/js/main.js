import app from './App';
import * as Backbone from 'backbone';
import SearchService from  "./services/search/SearchService";
import FormService from  "./services/form/FormService";
import UserService from  "./services/user/UserService";

app.on('start', function(){

	this.form = new FormService({});

	this.search = new SearchService({});

	this.form = new UserService({});

	Backbone.history.start();
});

app.start();
