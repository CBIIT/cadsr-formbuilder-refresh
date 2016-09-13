import Marionette from "backbone.marionette";
import {Model, Collection} from "backbone";

/**
 * This is service that maintains the state of user details and auth
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */
const UserService = Marionette.Object.extend({
	channelName: 'user',
	radioRequests: {
		'get:userName': 'getUserName',
		'isLoggedIn': 'isUserLoggedIn'
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