import Marionette from "backbone.marionette";
import {Model, Collection} from "backbone";
import {userChannel, appChannel} from '../../channels/radioChannels';
import EVENTS from '../../constants/EVENTS';

/**
 * This is service that maintains the state of user details and auth
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */
const UserService = Marionette.Object.extend({
	channelName: 'user',
	radioRequests: {
		'isLoggedIn': 'isUserLoggedIn'
	},
	initialize() {
		/* Auth isn't ready yet.  this trigger will be moved out of init once auth is setup on the FE */
		appChannel.trigger(EVENTS.USER.LOGIN_SUCCESS, () =>{
			console.log("login success");
		});

		appChannel.reply(EVENTS.USER.GET_USERNAME, this.getUserName);
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