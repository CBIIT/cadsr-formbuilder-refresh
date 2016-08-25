import Service from "marionette-service";
import {Model, Collection} from "backbone";

/**
 * This is a simple service that maintains the
 * state of search functionality, and passes it on
 * to any other parts of the code that request it
 * This currently uses Marionette-service for its service
 * object, in Mn 3.0 this will be replaceable with
 * Marionette.Object without any external dependencies
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */
const UserService = Service.extend({
	radioRequests: {
		'user get:userName': 'getUserName',
		'user isLoggedIn': 'isUserLoggedIn'
	},
	getUserName () {
		/* just a placeholer. will get from a model */
		return 'guest';
	},
	isUserLoggedIn(){
		/* just a placeholder */
		return true;
	}
});

export default UserService;